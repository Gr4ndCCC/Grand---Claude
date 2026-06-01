/**
 * Simple per-IP rate limiter backed by a module-level Map.
 * State survives within a single Vercel function instance lifetime,
 * so it stops burst abuse even though it doesn't share state across instances.
 */
const hits = new Map();
let lastGc = Date.now();

export function getIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Returns true if the request is within the allowed rate.
 * @param {string} ip
 * @param {{ maxHits?: number, windowMs?: number }} opts
 */
export function checkRate(ip, { maxHits = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  if (now - lastGc > 120_000) {
    for (const [key, times] of hits) {
      const fresh = times.filter(t => now - t < windowMs);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
    lastGc = now;
  }
  const key = String(ip || 'unknown');
  const times = (hits.get(key) || []).filter(t => now - t < windowMs);
  times.push(now);
  hits.set(key, times);
  return times.length <= maxHits;
}
