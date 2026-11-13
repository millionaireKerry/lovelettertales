import { runtime } from '../../server/runtime.mjs';

export default async () => {
  if (process.env.LLT_AUTOMATION_ENABLED !== 'true') return;
  // Scheduled functions are not public HTTP endpoints on Netlify.
  await runtime().service.retry();
};
export const config = { schedule:'*/10 * * * *' };
