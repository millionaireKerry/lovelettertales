import { createHash, randomBytes } from 'node:crypto';

export const hash = value => createHash('sha256').update(value).digest('hex');
export const newCode = () => 'LLT-' + randomBytes(16).toString('hex').toUpperCase().match(/.{8}/g).join('-');
export const normaliseCode = value => String(value || '').trim().toUpperCase();
export const isNewCode = code => /^LLT-(?:[A-F0-9]{8}-){3}[A-F0-9]{8}$/.test(code);
export const orderKey = id => 'orders/' + id;
export const codeKey = code => 'codes/' + hash(code);

// Every mutation uses a strong read and compare-and-set. Webhook retries and
// simultaneous redemptions cannot overwrite each other or mint extra gifts.
export async function mutate(store, key, update) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const existing = await store.getWithMetadata(key, { type: 'json' });
    const next = update(existing ? structuredClone(existing.data) : null);
    if (next === undefined) return existing?.data ?? null;
    const result = await store.setJSON(key, next, existing ? { onlyIfMatch: existing.etag } : { onlyIfNew: true });
    if (result.modified) return next;
  }
  throw new Error('Concurrent update; please retry');
}
