/**
 * Simple in-memory + localStorage cache for API responses
 * TTL: 5 minutes by default
 */

const CACHE_VERSION = 'v1';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in ms

const memCache = new Map(); // in-memory for same session (instant)

export function getCached(key) {
  const fullKey = `${CACHE_VERSION}:${key}`;

  // 1. Check memory cache first (fastest)
  if (memCache.has(fullKey)) {
    const { data, expires } = memCache.get(fullKey);
    if (Date.now() < expires) return data;
    memCache.delete(fullKey);
  }

  // 2. Check localStorage (survives page refresh)
  try {
    const raw = localStorage.getItem(fullKey);
    if (raw) {
      const { data, expires } = JSON.parse(raw);
      if (Date.now() < expires) {
        memCache.set(fullKey, { data, expires }); // warm up memory
        return data;
      }
      localStorage.removeItem(fullKey);
    }
  } catch (_) { /* ignore */ }

  return null;
}

export function setCached(key, data, ttl = DEFAULT_TTL) {
  const fullKey = `${CACHE_VERSION}:${key}`;
  const expires = Date.now() + ttl;

  // Store in both memory and localStorage
  memCache.set(fullKey, { data, expires });
  try {
    localStorage.setItem(fullKey, JSON.stringify({ data, expires }));
  } catch (_) { /* quota exceeded - memory cache still works */ }
}

export function clearCache(keyPattern) {
  for (const key of memCache.keys()) {
    if (!keyPattern || key.includes(keyPattern)) memCache.delete(key);
  }
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(CACHE_VERSION) && (!keyPattern || k.includes(keyPattern))) {
        localStorage.removeItem(k);
      }
    }
  } catch (_) { /* ignore */ }
}

export default { getCached, setCached, clearCache };
