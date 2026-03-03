import { safeGetJSON, safeSetJSON, safeRemoveItem } from './storage';

export function createCacheHelpers(cacheKeyPrefix) {
  return {
    get: (id) => safeGetJSON(`${cacheKeyPrefix}-${id}`),
    set: (id, data) => safeSetJSON(`${cacheKeyPrefix}-${id}`, data),
    remove: (id) => safeRemoveItem(`${cacheKeyPrefix}-${id}`),
  };
}
