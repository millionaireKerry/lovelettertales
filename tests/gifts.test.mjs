import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { createGiftService } from '../server/gifts.mjs';
import { configuration, LIVE_LINKS } from '../server/catalog.mjs';
import { orderKey } from '../server/storage.mjs';
import { createHandler as stripeHandler } from '../netlify/functions/stripe-webhook.mjs';
import { createHandler as browserHandler } from '../netlify/functions/gifts.mjs';
import { sendResend } from '../server/email.mjs';

class MemoryStore {
  data=new Map(); revision=0;
  async getWithMetadata(key) { return structuredClone(this.data.get(key) || null); }
  async get(key) { return structuredClone(this.data.get(key)?.data || null); }
  async setJSON(key,data,options={}) {
    const existing=this.data.get(key);
    if (options.onlyIfNew && existing || options.onlyIfMatch && existing?.etag !== options.onlyIfMatch) return {modified:false};
    const etag=String(++this.revision); this.data.set(key,{data:structuredClone(data),etag}); return {modified:true,etag};
  }
  async *list({prefix}) { yield {blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))}; }
}
function fixture() {
  const store=new MemoryStore(); let clock=Date.now(); const sent=new Map(); let fail=false;
  const config={live:false,start:100,site:'https://lovelettertales.com',links:LIVE_LINKS,
    from:'Love Letter Tales <gifts@lovelettertales.com>',owner:'owner@example.com',replyTo:'owner@example.com',testRecipient:'test@example.com'};
  const session={id:'cs_test_example123',livemode:false,created:200,status:'complete',payment_status:'paid',payment_link:'plink_example',
    currency:'gbp',amount_total:3499,mode:'payment',customer_details:{email:'buyer@example.com'},
    payment_intent:{id:'pi_example',latest_charge:{id:'ch_example',paid:true,refunded:false,disputed:false,amount_refunded:0}}};
  const line={quantity:1,price:{unit_amount:3499}};
  const stripe={checkout:{sessions:{retrieve:async()=>structuredClone(session),listLineItems:async()=>({data:[structuredClone(line)],has_more:false})}},
    paymentLinks:{retrieve:async()=>({url:'https://buy.stripe.com/7sY9AS8fX2Zgdgw9kY1Nu02'})}};
  const send=async(payload,key)=>{
    if (fail) throw new Error('Transient network error');
    if (sent.has(key)) { assert.deepEqual(sent.get(key).payload,payload,'Idempotency payload must stay immutable'); return sent.get(key).id; }
    const id='email-example-'+sent.size; sent.set(key,{payload:structuredClone(payload),id}); return id;
  };
  const service=createGiftService({store,stripe,config,send,now:()=>clock});
  return {store,config,session,line,service,sent,fail:()=>{fail=true;},recover:()=>{fail=false;},advance:ms=>{clock+=ms;}};
}
const details=code=>({code,name:'Gift Recipient',email:'recipient@example.com',address:'1 Example Street\nLondon',postcode:'SW1A 1AA',country:'United Kingdom',story:'Clara Wren'});

test('Paid order is issued once under simultaneous webhook/landing page calls; every quantity has a code',async()=>{
  const f=fixture(); f.line.quantity=2; f.session.amount_total=6998;
  const results=await Promise.all(Array.from({length:6},()=>f.service.fulfil(f.session.id)));
  assert.equal(f.sent.size,2); assert.equal(results[0].gifts.length,2);
  assert.notEqual(results[0].gifts[0].code,results[0].gifts[1].code);
  for(const result of results) assert.deepEqual(result.gifts,results[0].gifts);
  const body=JSON.stringify(results[0]); assert.ok(!body.includes('buyer@example.com')); assert.ok(!body.includes('payload'));
  for(const {payload} of f.sent.values()) assert.deepEqual(payload.to,['test@example.com']);
});

test('Unpaid, old, refunded, disputed, wrong amount and unknown Payment Links never create cards or email',async()=>{
  for(const mutate of [s=>s.payment_status='unpaid',s=>s.created=99,s=>s.livemode=true,s=>s.amount_total=1,
    s=>s.payment_intent.latest_charge.refunded=true,s=>s.payment_intent.latest_charge.disputed=true,
    s=>s.payment_intent.latest_charge.amount_refunded=1,s=>s.payment_link=null]) {
    const f=fixture(); mutate(f.session); await assert.rejects(f.service.fulfil(f.session.id)); assert.equal(f.store.data.size,0); assert.equal(f.sent.size,0);
  }
  const f=fixture(); f.config.links={}; await assert.rejects(f.service.fulfil(f.session.id)); assert.equal(f.sent.size,0);
});

test('Failed sends remain durable and retry without creating new cards',async()=>{
  const f=fixture(); f.fail(); const first=await f.service.fulfil(f.session.id);
  assert.equal(first.emailState,'pending'); assert.equal(f.sent.size,0);
  f.recover(); f.advance(600000); await f.service.retry();
  const next=await f.service.fulfil(f.session.id);
  assert.equal(next.emailState,'accepted'); assert.deepEqual(first.gifts,next.gifts); assert.equal(f.sent.size,2);
  await f.service.retry(); assert.equal(f.sent.size,2);
});

test('Ambiguous email beyond Resend idempotency window requires manual review',async()=>{
  const f=fixture(); f.fail(); await f.service.fulfil(f.session.id);
  f.recover(); f.advance(24*3600000); await f.service.retry();
  assert.equal(f.sent.size,0); assert.equal((await f.store.get(orderKey(f.session.id))).emails.gift.state,'attention');
});

test('Redemption persists exactly once, survives email failure, and never exposes the address through a code',async()=>{
  const f=fixture(); const {gifts}=await f.service.fulfil(f.session.id); const code=gifts[0].code;
  f.fail(); await Promise.all([f.service.redeem(details(code)),f.service.redeem(details(code))]);
  const order=await f.store.get(orderKey(f.session.id));
  assert.equal(order.gifts[0].redemption.address,'1 Example Street\nLondon');
  assert.equal(Object.keys(order.emails).length,4);
  await assert.rejects(f.service.redeem({...details(code),name:'Someone Else'}),/already been redeemed/);
  assert.equal((await f.service.card(code)).redeemed,true);
  assert.ok(!JSON.stringify(await f.service.card(code)).includes('Example Street'));
  f.recover(); f.advance(600000); await f.service.retry(); assert.equal(f.sent.size,4);
});

test('UK restrictions, invented codes, incomplete addresses and later refunds cannot redeem',async()=>{
  const f=fixture(); const {gifts}=await f.service.fulfil(f.session.id); const code=gifts[0].code;
  await assert.rejects(f.service.redeem({...details(code),country:'United States'}),/UK delivery/);
  await assert.rejects(f.service.redeem({...details(code),address:''}));
  await assert.rejects(f.service.redeem(details('LLT-00000000-00000000-00000000-00000000')),/could not find/);
  await assert.rejects(f.service.redeem(details('LLT-3M-X7K2')),/older gift code/);
  f.session.payment_intent.latest_charge.refunded=true;
  await assert.rejects(f.service.redeem(details(code)),/cannot currently be redeemed/);
  assert.ok(!(await f.store.get(orderKey(f.session.id))).gifts[0].redemption);
});

test('Email delivery reports are idempotent, ordered, and create one owner alert for a bounce',async()=>{
  const f=fixture(); await f.service.fulfil(f.session.id);
  const gift=(await f.store.get(orderKey(f.session.id))).emails.gift;
  const event={type:'email.bounced',created_at:new Date().toISOString(),data:{email_id:gift.providerId}};
  await f.service.delivery(event); await f.service.delivery(event);
  await f.service.delivery({...event,type:'email.delivered',created_at:'2020-01-01T00:00:00Z'});
  const order=await f.store.get(orderKey(f.session.id));
  assert.equal(order.emails.gift.delivery,'bounced'); assert.equal(Object.keys(order.emails).length,3);
});

test('HTML injection in delivery details is escaped in the fulfilment email',async()=>{
  const f=fixture(); const {gifts}=await f.service.fulfil(f.session.id);
  await f.service.redeem({...details(gifts[0].code),name:'<img src=x onerror=alert(1)>'});
  const mail=[...f.sent.entries()].find(([key])=>key.includes('redeem-owner'))[1].payload;
  assert.ok(!mail.html.includes('<img')); assert.ok(mail.html.includes('&lt;img'));
});

test('Live automation cannot run on previews, use test keys, or start without an activation boundary',()=>{
  const env={LLT_AUTOMATION_ENABLED:'true',LLT_MODE:'live',CONTEXT:'production',STRIPE_SECRET_KEY:'rk_live_example',
    STRIPE_WEBHOOK_SECRET:'whsec_example',RESEND_API_KEY:'re_example',LLT_FROM_EMAIL:'gifts@example.com',LLT_OWNER_EMAIL:'owner@example.com',LLT_AUTOMATION_START_AT:'2026-11-13T12:00:00Z'};
  assert.equal(configuration(env).live,true);
  for(const change of [{CONTEXT:'deploy-preview'},{STRIPE_SECRET_KEY:'rk_test_example'},{LLT_AUTOMATION_START_AT:''},{LLT_AUTOMATION_ENABLED:'false'}]) assert.throws(()=>configuration({...env,...change}));
});

test('Actual HTTP webhook rejects forged signatures; paid signed events call fulfilment; unpaid events do not',async()=>{
  const stripe=new Stripe('sk_test_example'); const secret='whsec_test_secret'; const ids=[];
  const handler=stripeHandler(()=>({stripe,config:{live:false,start:100},service:{fulfil:async id=>ids.push(id)}}),()=>secret);
  const event={type:'checkout.session.completed',livemode:false,data:{object:{id:'cs_test_signed123',created:200,payment_status:'paid'}}};
  const payload=JSON.stringify(event);
  const req=(body,signature)=>new Request('https://lovelettertales.com/api/stripe-webhook',{method:'POST',body,headers:{'stripe-signature':signature}});
  assert.equal((await handler(req(payload,'fake'))).status,400); assert.equal(ids.length,0);
  const sign=body=>stripe.webhooks.generateTestHeaderString({payload:body,secret});
  assert.equal((await handler(req(payload,sign(payload)))).status,200); assert.deepEqual(ids,['cs_test_signed123']);
  event.data.object.payment_status='unpaid'; const unpaid=JSON.stringify(event);
  assert.equal((await handler(req(unpaid,sign(unpaid)))).status,200); assert.equal(ids.length,1);
});

test('Browser endpoint rejects cross-site calls, oversized bodies and invalid JSON before accessing any service',async()=>{
  let calls=0; const handler=browserHandler(()=>{calls++;throw new Error('must not run');});
  const req=(body,origin='https://evil.example')=>new Request('https://lovelettertales.com/api/gifts',{method:'POST',body,headers:{'Content-Type':'application/json',origin}});
  assert.equal((await handler(req('{}'))).status,403);
  assert.equal((await handler(req('{','https://lovelettertales.com'))).status,400);
  assert.equal((await handler(req('x'.repeat(15000),'https://lovelettertales.com'))).status,400); assert.equal(calls,0);
});

test('Resend receives an idempotency header; non-2xx and unacknowledged sends are failures',async()=>{
  let options;
  const id=await sendResend({to:['owner@example.com']},'stable-key','re_example',async(url,opts)=>{options=opts;return new Response(JSON.stringify({id:'email-123'}));});
  assert.equal(id,'email-123'); assert.equal(options.headers['Idempotency-Key'],'stable-key');
  await assert.rejects(sendResend({},'key','key',async()=>new Response('{}',{status:429})));
  await assert.rejects(sendResend({},'key','key',async()=>new Response('{}')));
});
