import { randomUUID } from 'node:crypto';
import { hash, newCode, normaliseCode, isNewCode, orderKey, codeKey, mutate } from './storage.mjs';
import { initialEmails, redemptionEmails, makeEmail } from './email.mjs';

export class PublicError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idOf = object => typeof object === 'string' ? object : object?.id;

export function createGiftService({ store, stripe, send, config, now = Date.now }) {
  async function paidSession(id) {
    if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id || '') || id.length > 240) throw new PublicError('This order link is not valid.');
    const s = await stripe.checkout.sessions.retrieve(id, { expand:['payment_intent.latest_charge'] });
    if (s.livemode !== config.live || s.created < config.start) throw new PublicError('This order needs a manual check. Please contact us.', 409);
    if (s.status !== 'complete' || s.payment_status !== 'paid') throw new PublicError('Payment is not confirmed yet. Please check again shortly.', 409);
    if (!s.payment_link) throw new PublicError('This order needs a manual check. Please contact us.', 409);
    const link = await stripe.paymentLinks.retrieve(idOf(s.payment_link));
    const url = new URL(link.url);
    const plan = url.origin === 'https://buy.stripe.com' && config.links[url.pathname.slice(1)];
    if (!plan || ![0,3,6,12].includes(plan.months) || !['UK','international'].includes(plan.zone)) throw new PublicError('This order is not an eligible gift purchase.', 409);
    const items = await stripe.checkout.sessions.listLineItems(id, { limit:100 });
    if (items.has_more || items.data.length !== 1) throw new PublicError('This order needs a manual check. Please contact us.', 409);
    const line = items.data[0];
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99 || s.currency !== 'gbp' || line.price?.unit_amount !== plan.amount || s.amount_total !== plan.amount * line.quantity) throw new PublicError('This order needs a manual check. Please contact us.', 409);
    if (plan.months && (s.mode !== 'payment' || !s.payment_intent || typeof s.payment_intent !== 'object')) throw new PublicError('Payment needs a manual check. Please contact us.', 409);
    const charge = s.payment_intent?.latest_charge;
    if (plan.months && (!charge || typeof charge !== 'object' || !charge.paid || charge.refunded || charge.amount_refunded > 0 || charge.disputed)) throw new PublicError('This payment cannot currently be redeemed. Please contact us.', 409);
    const email = s.customer_details?.email || s.customer_email;
    if (!emailPattern.test(email || '') || email.length > 254) throw new PublicError('This order needs an email address checked. Please contact us.', 409);
    return { s, plan, quantity:line.quantity, email };
  }

  async function repairIndexes(order) {
    for (const gift of order.gifts) await store.setJSON(codeKey(gift.code), { id:order.id, index:gift.index }, { onlyIfNew:true });
  }

  async function fulfil(id) {
    const { s, plan, quantity, email } = await paidSession(id);
    let order = await mutate(store, orderKey(id), existing => {
      if (existing) return undefined;
      const created = { id, createdAt:now(), paymentIntent:idOf(s.payment_intent) || id,
        email, amount:s.amount_total, plan, status:'paid',
        gifts:plan.months ? Array.from({length:quantity}, (_, index) => ({ index, code:newCode() })) : [] };
      created.emails = initialEmails(created, config);
      return created;
    });
    await repairIndexes(order);
    await dispatch(id);
    return publicOrder(await store.get(orderKey(id), { type:'json' }));
  }

  function publicOrder(order) {
    // The unguessable Checkout Session ID is a buyer-only capability. No address,
    // buyer email, API credentials or provider response is returned to the browser.
    return { gifts:order.gifts.map(g => ({code:g.code, months:order.plan.months, zone:order.plan.zone,
      redeemed:!!g.redemption})), emailState:order.emails.gift?.state || 'not-applicable',
      delivery:order.emails.gift?.delivery || null };
  }

  async function findGift(input) {
    const code = normaliseCode(input);
    if (!isNewCode(code)) throw new PublicError('For an older gift code, please use the gift request form below.', 404);
    const ref = await store.get(codeKey(code), {type:'json'});
    const order = ref && await store.get(orderKey(ref.id), {type:'json'});
    const gift = order?.gifts[ref.index];
    if (!gift || gift.code !== code) throw new PublicError('We could not find that gift code. Please check it or contact us.', 404);
    return { order, gift };
  }

  async function card(code) {
    const {order,gift} = await findGift(code);
    await paidSession(order.id); // Refunded/disputed purchases cannot look active.
    return { code:gift.code, months:order.plan.months, zone:order.plan.zone, redeemed:!!gift.redemption };
  }

  async function redeem(data) {
    const { order, gift } = await findGift(data.code);
    const r = {};
    for (const [key, max] of Object.entries({name:100,email:254,address:600,postcode:24,country:80,story:30})) {
      if (typeof data[key] !== 'string' || !data[key].trim() || data[key].length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(data[key])) throw new PublicError('Please check all your delivery details.');
      r[key] = data[key].trim();
    }
    r.email = r.email.toLowerCase();
    if (!emailPattern.test(r.email) || !['Rose Ashworth','Clara Wren'].includes(r.story)) throw new PublicError('Please check your email address and chosen story.');
    if (order.plan.zone === 'UK' && !/^(united kingdom|uk|gb|great britain|england|scotland|wales|northern ireland)$/i.test(r.country)) throw new PublicError('This gift includes UK delivery. Please contact us to arrange delivery elsewhere.');
    const fingerprint = hash(JSON.stringify(r));
    await paidSession(order.id);
    await mutate(store, orderKey(order.id), current => {
      const target = current.gifts[gift.index];
      if (target.redemption) {
        if (target.redemption.fingerprint === fingerprint) return undefined;
        throw new PublicError('This gift has already been redeemed. Please contact us to change delivery details.', 409);
      }
      target.redemption = { ...r, fingerprint, createdAt:now(), fulfilment:'awaiting-preparation' };
      Object.assign(current.emails, redemptionEmails(current, target, config));
      return current;
    });
    // A mail outage must not undo a successful redemption or discard the address.
    await dispatch(order.id);
    return { redeemed:true };
  }

  async function dispatch(id) {
    const stored = await store.get(orderKey(id), {type:'json'});
    if (!stored) return;
    for (const name of Object.keys(stored.emails)) {
      const lease = randomUUID();
      let claimed = false;
      const order = await mutate(store, orderKey(id), current => {
        claimed = false;
        const message = current.emails[name];
        if (!message || ['accepted','attention'].includes(message.state) || (message.leaseUntil || 0) > now() || (message.nextAttempt || 0) > now()) return undefined;
        // Resend retains idempotency keys for 24h. Stop before that window ends;
        // an ambiguous send must be checked manually, never blindly reissued.
        if (message.firstAttempt !== undefined && now() - message.firstAttempt >= 23 * 3600000) {
          message.state = 'attention'; message.reason = 'Check Resend before retrying: idempotency window ended'; return current;
        }
        message.firstAttempt ??= now();
        message.attempts = (message.attempts || 0) + 1;
        message.lease = lease; message.leaseUntil = now() + 60000;
        claimed = true;
        return current;
      });
      if (!claimed) continue;
      const message = order.emails[name];
      try {
        const providerId = await send(message.payload, `llt/${id}/${name}`);
        await store.setJSON('emails/' + providerId, {id,name}, {onlyIfNew:true});
        await mutate(store, orderKey(id), current => {
          const target = current.emails[name];
          if (target.lease !== lease) return undefined;
          target.state = 'accepted'; target.providerId = providerId; target.acceptedAt = now();
          delete target.lease; delete target.leaseUntil; delete target.payload;
          return current;
        });
        const early = await store.get('delivery/' + providerId, {type:'json'});
        if (early) await delivery(early);
      } catch (error) {
        await mutate(store, orderKey(id), current => {
          const target = current.emails[name];
          if (target.lease !== lease) return undefined;
          target.state = error.permanent ? 'attention' : 'pending';
          target.reason = error.permanent ? 'Email provider rejected the message; review configuration' : 'Email send not confirmed; retry scheduled';
          target.nextAttempt = now() + Math.min(3600000, 60000 * 2 ** Math.min(target.attempts, 6));
          delete target.lease; delete target.leaseUntil;
          return current;
        });
      }
    }
  }

  async function delivery(event) {
    const providerId = event.data?.email_id;
    if (!/^[a-zA-Z0-9-]{10,80}$/.test(providerId || '')) return;
    if (!['email.delivered','email.delivery_delayed','email.bounced','email.failed','email.complained'].includes(event.type)) return;
    const timestamp = Date.parse(event.created_at);
    if (!Number.isFinite(timestamp)) return;
    // Store a small status only; delivery callbacks may arrive before send returns.
    const small = {type:event.type,created_at:event.created_at,data:{email_id:providerId}};
    await mutate(store, 'delivery/' + providerId, existing => !existing || Date.parse(existing.created_at) < timestamp ? small : undefined);
    const ref = await store.get('emails/' + providerId, {type:'json'});
    if (!ref) return;
    await mutate(store, orderKey(ref.id), current => {
      const message = current?.emails[ref.name];
      if (!message || (message.deliveryAt || 0) >= timestamp) return undefined;
      message.delivery = event.type.slice(6); message.deliveryAt = timestamp;
      if (['bounced','failed','complained'].includes(message.delivery) && !ref.name.startsWith('owner') && !ref.name.includes('owner')) {
        const name = 'owner-delivery-' + hash(ref.name).slice(0,12);
        const text = `An order email was ${message.delivery}. Check Resend and contact the buyer before sending again.\nOrder: ${ref.id}\nEmail record: ${providerId}\nhttps://resend.com/emails/${providerId}`;
        current.emails[name] ??= {state:'pending',payload:makeEmail(config,config.owner,'Action needed — an order email did not arrive',text,`<p>${text.replace(/\n/g,'<br>')}</p>`,'delivery-alert')};
      }
      return current;
    });
  }

  async function retry() {
    let processed = 0;
    for await (const page of store.list({prefix:'orders/',paginate:true})) {
      for (const entry of page.blobs) {
        const order = await store.get(entry.key, {type:'json'});
        if (!Object.values(order.emails).some(m => m.state === 'pending')) continue;
        try { await paidSession(order.id); }
        catch (error) {
          if (!(error instanceof PublicError)) throw error;
          await mutate(store, entry.key, current => {
            for (const m of Object.values(current.emails)) if (m.state === 'pending') { m.state='attention'; m.reason='Payment needs review before retry'; }
            return current;
          });
          continue;
        }
        await repairIndexes(order);
        await dispatch(order.id);
        if (++processed >= 10) return; // bounded work per invocation
      }
    }
  }
  return { fulfil, card, redeem, dispatch, delivery, retry };
}
