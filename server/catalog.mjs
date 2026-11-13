// Match existing Payment Links, never a price or plan supplied by the browser.
export const LIVE_LINKS = Object.freeze({
  '7sY9AS8fX2Zgdgw9kY1Nu02': { months: 3, zone: 'UK', amount: 3499 },
  'eVqcN4gMtfM25O440E1Nu01': { months: 6, zone: 'UK', amount: 6499 },
  'bJedR8bs9gQ6dgwdBe1Nu00': { months: 12, zone: 'UK', amount: 10999 },
  'fZu00i7bT43kfoE1Sw1Nu07': { months: 3, zone: 'international', amount: 4999 },
  '00wfZgbs97fwa4k40E1Nu08': { months: 6, zone: 'international', amount: 9499 },
  'cNi4gybs9arIb8odBe1Nu09': { months: 12, zone: 'international', amount: 16999 },
  '28E00idAhgQ6dgw8gU1Nu03': { months: 0, zone: 'UK', amount: 1299 },
  '4gM3cuao50R8foE2WA1Nu04': { months: 0, zone: 'UK', amount: 11999 },
  '4gM4gy7bTarI90g1Sw1Nu05': { months: 0, zone: 'international', amount: 1799 },
  'bJe6oGfIp57o4K07cQ1Nu06': { months: 0, zone: 'international', amount: 17999 },
});

export function configuration(env = process.env) {
  if (env.LLT_AUTOMATION_ENABLED !== 'true') throw new Error('Automation is not enabled');
  const live = env.LLT_MODE === 'live';
  if (!live && env.LLT_MODE !== 'test') throw new Error('Set LLT_MODE');
  if (live && env.CONTEXT !== 'production') throw new Error('Live sending is production-only');
  const prefix = live ? /^(sk|rk)_live_/ : /^(sk|rk)_test_/;
  if (!prefix.test(env.STRIPE_SECRET_KEY || '')) throw new Error('Wrong Stripe key mode');
  const start = Date.parse(env.LLT_AUTOMATION_START_AT || '');
  if (!Number.isFinite(start)) throw new Error('Set the activation time before enabling');
  for (const key of ['RESEND_API_KEY', 'LLT_FROM_EMAIL', 'LLT_OWNER_EMAIL', 'STRIPE_WEBHOOK_SECRET']) {
    if (!env[key]) throw new Error(`Missing ${key}`);
  }
  const site = new URL(env.LLT_SITE_URL || 'https://lovelettertales.com');
  if (live && site.origin !== 'https://lovelettertales.com') throw new Error('Wrong production origin');
  if (!live && !env.LLT_TEST_RECIPIENT) throw new Error('Test delivery needs an explicit recipient');
  const links = live ? LIVE_LINKS : JSON.parse(env.LLT_TEST_LINKS_JSON || '{}');
  if (!Object.keys(links).length) throw new Error('No test payment link configured');
  return { live, start: Math.floor(start / 1000), site: site.origin, links,
    from: env.LLT_FROM_EMAIL, owner: env.LLT_OWNER_EMAIL,
    replyTo: env.LLT_REPLY_TO || env.LLT_OWNER_EMAIL, testRecipient: env.LLT_TEST_RECIPIENT,
    storeName: `llt-orders-v1-${live ? 'live' : 'test'}` };
}
