/**
 * Cache Service: In-memory cache with TTL
 */
const CACHE = new Map();
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const getCache = (key) => {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > TTL_MS) {
    CACHE.delete(key);
    return null;
  }
  return entry.value;
};

export const setCache = (key, value) => {
  CACHE.set(key, { value, time: Date.now() });
};

export const clearCache = () => {
  CACHE.clear();
};

export default { getCache, setCache, clearCache };
