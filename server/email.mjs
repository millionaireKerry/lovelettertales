export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

function shell(title, content) {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f8f3ec;color:#34252a;font:16px/1.7 Georgia,serif"><div style="max-width:600px;margin:32px auto;background:#fffdf8;padding:36px;border:1px solid #e7dbcb"><p style="letter-spacing:3px;font:12px Arial,sans-serif;color:#814454">LOVE LETTER TALES</p><h1 style="font-size:30px;font-weight:normal">${escapeHtml(title)}</h1>${content}<hr style="border:0;border-top:1px solid #e7dbcb;margin:28px 0"><p style="font-size:14px">With love,<br>Love Letter Tales</p><p style="font:12px/1.6 Arial,sans-serif">Need a hand? Reply to this email.<br>Two story letters a month, delivered by post.</p></div></body></html>`;
}

export function makeEmail(config, to, subject, text, html, kind) {
  return { from: config.from, to: [config.live ? to : config.testRecipient],
    reply_to: config.replyTo, subject: (config.live ? '' : '[TEST] ') + subject,
    text, html, tags: [{ name: 'kind', value: kind }] };
}

export function initialEmails(order, config) {
  const payment = `https://dashboard.stripe.com/${config.live ? '' : 'test/'}payments/${order.paymentIntent}`;
  const emails = {};
  if (order.gifts.length) {
    const links = order.gifts.map((gift, i) => ({ code: gift.code, index: i + 1,
      card: `${config.site}/gift-card.html#code=${gift.code}`,
      redeem: `${config.site}/redeem.html#code=${gift.code}` }));
    const description = `${order.plan.months} months · ${order.plan.months * 2} letters · ${order.plan.zone} delivery`;
    const intro = `Thank you for giving a story. Your ${order.gifts.length === 1 ? 'gift card is' : 'gift cards are'} ready. ${description}.`;
    const instructions = 'Open your card, add a name and message, then print it or save it as a PDF to give to your recipient. Your recipient uses the gift code to choose a story and tell us where to post the letters. The letters start after redemption; a complete story takes 12 months (24 letters). Keep these links private: anyone with a code can redeem it.';
    const text = [intro, ...links.map(l => `Gift ${l.index}\nCard: ${l.card}\nCode: ${l.code}\nRedeem: ${l.redeem}`), instructions, 'Need help? Reply to this email.'].join('\n\n');
    const html = shell('A story, ready to give.', `<p>${escapeHtml(intro)}</p>${links.map(l => `<p><a href="${l.card}" style="display:inline-block;padding:12px 22px;background:#713c4b;color:white;text-decoration:none">Open gift card${links.length > 1 ? ' ' + l.index : ''}</a></p><p style="font-size:12px;overflow-wrap:anywhere">Gift code: ${l.code}<br><a href="${l.redeem}">Redeem this gift</a></p>`).join('')}<p>${escapeHtml(instructions)}</p>`);
    emails.gift = { state: 'pending', payload: makeEmail(config, order.email, 'Your Love Letter Tales gift card', text, html, 'gift-card') };
  }
  const text = `New paid order: £${(order.amount / 100).toFixed(2)}\nBuyer: ${order.email}\n${order.gifts.length ? `${order.gifts.length} × ${order.plan.months}-month gift; ${order.plan.zone} delivery. Gift email queued. Watch for redemption before posting.` : 'Subscription: check the story and postal address, then arrange fulfilment.'}\nStripe: ${payment}\nOrder: ${order.id}`;
  emails.owner = { state: 'pending', payload: makeEmail(config, config.owner, 'New paid Love Letter Tales order', text, shell('A new order has arrived.', `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`), 'order-alert') };
  return emails;
}

export function redemptionEmails(order, gift, config) {
  const r = gift.redemption;
  const detail = `${r.name}\n${r.address}\n${r.postcode}\n${r.country}\nEmail: ${r.email}\nStory: ${r.story}\n${order.plan.months} months / ${order.plan.months * 2} letters\nOrder: ${order.id}`;
  const buyer = 'Your gift has been redeemed and your delivery details are saved. We will prepare your first letters and email you when they are ready to post. If you need to correct your address, reply to this email.';
  return {
    [`redeem-owner-${gift.index}`]: { state:'pending', payload:makeEmail(config, config.owner, 'Gift redeemed — letters need preparing', detail, shell('A gift is ready to fulfil.', `<p>${escapeHtml(detail).replace(/\n/g, '<br>')}</p><p>This is a fulfilment request. The physical letters still need preparing and posting.</p>`), 'redemption-alert') },
    [`redeem-customer-${gift.index}`]: { state:'pending', payload:makeEmail(config, r.email, 'Your Love Letter Tales gift is redeemed', buyer + '\n\n' + detail.replace(/\nOrder:.*/, ''), shell('Your story begins here.', `<p>${escapeHtml(buyer)}</p><p>${escapeHtml(detail.replace(/\nOrder:.*/, '')).replace(/\n/g, '<br>')}</p>`), 'redemption-confirmation') },
  };
}

export async function sendResend(payload, key, apiKey, fetcher = fetch) {
  const response = await fetcher('https://api.resend.com/emails', { method:'POST',
    headers:{ Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json', 'Idempotency-Key':key },
    body:JSON.stringify(payload), signal:AbortSignal.timeout(12000) });
  if (!response.ok) {
    const error = new Error(`Email provider HTTP ${response.status}`);
    error.permanent = response.status >= 400 && response.status < 500 && ![408, 409, 429].includes(response.status);
    throw error;
  }
  const result = await response.json();
  if (!result.id) throw new Error('Email provider did not acknowledge delivery');
  return result.id;
}
