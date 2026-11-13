import Stripe from 'stripe';
import { getStore } from '@netlify/blobs';
import { configuration } from './catalog.mjs';
import { createGiftService } from './gifts.mjs';
import { sendResend } from './email.mjs';

export function runtime() {
  const config = configuration();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { timeout:10000, maxNetworkRetries:1 });
  const store = getStore({name:config.storeName, consistency:'strong'});
  const service = createGiftService({store, stripe, config,
    send:(payload,key) => sendResend(payload,key,process.env.RESEND_API_KEY)});
  return { config, stripe, service };
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers:{
    'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store',
    'Referrer-Policy':'no-referrer', 'X-Content-Type-Options':'nosniff' } });
}

export async function readBody(request, limit = 12000) {
  if (Number(request.headers.get('content-length')) > limit) throw new Error('Body too large');
  const reader = request.body?.getReader();
  if (!reader) return '';
  let length=0; const chunks=[];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.length;
    if (length > limit) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(chunk.value);
  }
  return Buffer.concat(chunks).toString('utf8');
}
