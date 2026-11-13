import { runtime, json, readBody } from '../../server/runtime.mjs';
import { PublicError } from '../../server/gifts.mjs';

export const createHandler = (getRuntime = runtime) => async request => {
  if (request.method !== 'POST') return json({error:'Use POST'},405);
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin || !request.headers.get('content-type')?.startsWith('application/json')) return json({error:'Invalid request'},403);
  let input;
  try { input=JSON.parse(await readBody(request)); }
  catch { return json({error:'Please check your form and try again.'},400); }
  if (!input || typeof input !== 'object' || input['bot-field']) return json({error:'Invalid request'},400);
  try {
    const {service} = getRuntime();
    if (input.action === 'order') return json(await service.fulfil(input.session));
    if (input.action === 'card') return json(await service.card(input.code));
    if (input.action === 'redeem') return json(await service.redeem(input));
    return json({error:'Invalid request'},400);
  } catch (error) {
    if (error instanceof PublicError) return json({error:error.message},error.status);
    // Never return Stripe responses, credentials, tokens or addresses in errors.
    console.error('Gift request could not complete');
    return json({error:'We could not complete this just now. Your payment has not been taken again. Please retry or contact us.'},503);
  }
};
export default createHandler();
export const config = { path:'/api/gifts', rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']} };
