import { Webhook } from 'svix';
import { runtime, json, readBody } from '../../server/runtime.mjs';

export default async request => {
  if (request.method !== 'POST') return json({error:'Use POST'},405);
  if (!process.env.RESEND_WEBHOOK_SECRET) return json({error:'Delivery tracking unavailable'},503);
  let event;
  try {
    event=new Webhook(process.env.RESEND_WEBHOOK_SECRET).verify(await readBody(request,200000),{
      'svix-id':request.headers.get('svix-id'), 'svix-timestamp':request.headers.get('svix-timestamp'),
      'svix-signature':request.headers.get('svix-signature') });
  } catch { return json({error:'Invalid signature'},400); }
  try { await runtime().service.delivery(event); return json({received:true}); }
  catch { console.error('Delivery status could not be recorded'); return json({error:'Retry required'},500); }
};
export const config = { path:'/api/resend-webhook' };
