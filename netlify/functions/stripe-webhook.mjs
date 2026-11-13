import { runtime, json, readBody } from '../../server/runtime.mjs';
import { PublicError } from '../../server/gifts.mjs';

export const createHandler = (getRuntime = runtime, secret = () => process.env.STRIPE_WEBHOOK_SECRET) => async request => {
  if (request.method !== 'POST') return json({error:'Use POST'},405);
  let app;
  try { app=getRuntime(); } catch { return json({error:'Automation unavailable'},503); }
  let event;
  try { event=app.stripe.webhooks.constructEvent(await readBody(request,200000),request.headers.get('stripe-signature'),secret()); }
  catch { return json({error:'Invalid signature'},400); }
  if (event.livemode !== app.config.live) return json({error:'Wrong mode'},400);
  if (!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)) return json({received:true});
  const session=event.data.object;
  if (session.created < app.config.start || session.payment_status !== 'paid') return json({received:true,ignored:true});
  try { await app.service.fulfil(session.id); return json({received:true}); }
  catch (error) {
    // Returning 500 keeps Stripe's retries and dashboard failures visible.
    console.error(error instanceof PublicError ? 'Paid order requires review' : 'Order processing failed');
    return json({error:'Order not processed; retry required'},500);
  }
};
export default createHandler();
export const config = { path:'/api/stripe-webhook' };
