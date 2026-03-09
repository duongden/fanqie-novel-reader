import { DIRECTORY_CACHE_KEY, CHAPTER_CACHE_KEY, DETAIL_CACHE_KEY } from './constants';
import { directoryCache, chapterCache, detailCache } from './cache';

/**
 * Migrates directory, detail, and chapter cache from localStorage to IndexedDB.
 * @returns {{ migrated: number }} Count of keys migrated
 */
export async function migrateCacheFromLocalStorage() {
  if (typeof window === 'undefined') return { migrated: 0 };
  let migrated = 0;
  const dirPrefix = DIRECTORY_CACHE_KEY + '-';
  const detailPrefix = DETAIL_CACHE_KEY + '-';
  const chapterPrefix = CHAPTER_CACHE_KEY + '-';
  const keys = Object.keys(localStorage);

  for (const k of keys) {
    try {
      if (k.startsWith(dirPrefix)) {
        const bookId = k.slice(dirPrefix.length);
        const raw = localStorage.getItem(k);
        if (raw) {
          const data = JSON.parse(raw);
          await directoryCache.set(bookId, data);
          localStorage.removeItem(k);
          migrated++;
        }
      } else if (k.startsWith(detailPrefix)) {
        const bookId = k.slice(detailPrefix.length);
        const raw = localStorage.getItem(k);
        if (raw) {
          const data = JSON.parse(raw);
          await detailCache.set(bookId, data);
          localStorage.removeItem(k);
          migrated++;
        }
      } else if (k.startsWith(chapterPrefix)) {
        const itemId = k.slice(chapterPrefix.length);
        const raw = localStorage.getItem(k);
        if (raw) {
          const data = JSON.parse(raw);
          await chapterCache.set(itemId, data);
          localStorage.removeItem(k);
          migrated++;
        }
      }
    } catch (err) {
      console.warn('Migration skip key:', k, err);
    }
  }
  return { migrated };
}
