import {
  BOOK_ID_KEY,
  DIRECTORY_CACHE_KEY,
  DETAIL_CACHE_KEY,
  CHAPTER_CACHE_KEY,
  LAST_READ_CHAPTERS_KEY,
  FONT_SIZE_KEY,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_DEFAULT,
  TRADITIONAL_CHINESE_KEY,
  TEXT_BRIGHTNESS_KEY,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  TEXT_BRIGHTNESS_DEFAULT,
} from './constants';

export function safeGetItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeGetJSON(key) {
  try {
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function safeSetJSON(key, value) {
  try {
    return safeSetItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function safeRemoveItem(key) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function deleteBookData(bookId) {
  if (!bookId) return;
  const directory = safeGetJSON(`${DIRECTORY_CACHE_KEY}-${bookId}`);
  const itemIds = directory?.data?.data?.data?.item_data_list?.map((item) => item.item_id) ?? [];
  safeRemoveItem(`${DIRECTORY_CACHE_KEY}-${bookId}`);
  safeRemoveItem(`${DETAIL_CACHE_KEY}-${bookId}`);
  itemIds.forEach((itemId) => safeRemoveItem(`${CHAPTER_CACHE_KEY}-${itemId}`));
  const lastChapters = safeGetJSON(LAST_READ_CHAPTERS_KEY) || {};
  delete lastChapters[bookId];
  safeSetJSON(LAST_READ_CHAPTERS_KEY, lastChapters);
  if (safeGetItem(BOOK_ID_KEY) === bookId) {
    safeRemoveItem(BOOK_ID_KEY);
  }
}

export function getLastReadChapter(bookId) {
  const data = safeGetJSON(LAST_READ_CHAPTERS_KEY);
  return data && bookId ? data[bookId] ?? null : null;
}

export function setLastReadChapter(bookId, itemId) {
  if (!bookId || !itemId) return false;
  const data = safeGetJSON(LAST_READ_CHAPTERS_KEY) || {};
  data[bookId] = String(itemId);
  return safeSetJSON(LAST_READ_CHAPTERS_KEY, data);
}

export function getFontSize() {
  const raw = safeGetItem(FONT_SIZE_KEY);
  if (raw == null) return FONT_SIZE_DEFAULT;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? FONT_SIZE_DEFAULT : Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, n));
}

export function setFontSize(size) {
  const clamped = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, size));
  return safeSetItem(FONT_SIZE_KEY, String(clamped));
}

export function getTextBrightness() {
  const raw = safeGetItem(TEXT_BRIGHTNESS_KEY);
  if (raw == null) return TEXT_BRIGHTNESS_DEFAULT;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? TEXT_BRIGHTNESS_DEFAULT : Math.max(TEXT_BRIGHTNESS_MIN, Math.min(TEXT_BRIGHTNESS_MAX, n));
}

export function setTextBrightness(value) {
  const clamped = Math.max(TEXT_BRIGHTNESS_MIN, Math.min(TEXT_BRIGHTNESS_MAX, value));
  return safeSetItem(TEXT_BRIGHTNESS_KEY, String(clamped));
}

export function getUseTraditionalChinese() {
  const raw = safeGetItem(TRADITIONAL_CHINESE_KEY);
  if (raw == null) return true; // enabled by default for new users
  return raw === '1';
}

export function setUseTraditionalChinese(enabled) {
  return safeSetItem(TRADITIONAL_CHINESE_KEY, enabled ? '1' : '0');
}
