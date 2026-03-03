import { API_BASE_KEY, DIRECTORY_CACHE_KEY, CHAPTER_CACHE_KEY, DETAIL_CACHE_KEY } from './utils/constants';
import { safeGetItem, safeSetItem } from './utils/storage';
import { createCacheHelpers } from './utils/cache';
import { maybeConvert } from './utils/zh-convert';

export const API_OPTIONS = [
  { id: 'bk', url: 'https://bk.yydjtc.cn', label: 'bk.yydjtc.cn' },
  { id: 'qkfq', url: 'https://qkfqapi.vv9v.cn', label: 'qkfqapi.vv9v.cn' },
];

const DEFAULT_API_BASE = API_OPTIONS[0].url;

export function getApiBase() {
  return safeGetItem(API_BASE_KEY) || DEFAULT_API_BASE;
}

export function setApiBase(url) {
  safeSetItem(API_BASE_KEY, url);
}

const REQUEST_TIMEOUT_MS = 45000; // 45 seconds
const DEBUG = true; // Set to false to disable API debug logs

function debug(...args) {
  if (DEBUG) {
    const ts = new Date().toISOString();
    console.log(`[API ${ts}]`, ...args);
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  debug('fetch start', url);
  const start = performance.now();

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    const elapsed = (performance.now() - start).toFixed(0);
    debug('fetch done', url, `status=${res.status}`, `${elapsed}ms`);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    const elapsed = (performance.now() - start).toFixed(0);
    if (err.name === 'AbortError') {
      debug('fetch timeout', url, `${elapsed}ms`);
      throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
    }
    debug('fetch error', url, err.message, `${elapsed}ms`);
    throw err;
  }
}

function stripHtmlTagsAndNewlines(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  let filteredText = (doc.body.textContent || '')
    .replace(/\n+/g, '\n')
    .replace(/\n\s*\n/g, '\n');
  if (filteredText.startsWith('\n')) filteredText = filteredText.substring(1);
  if (!filteredText.endsWith('\n')) filteredText += '\n';
  return filteredText;
}

const directoryCache = createCacheHelpers(DIRECTORY_CACHE_KEY);
const chapterCache = createCacheHelpers(CHAPTER_CACHE_KEY);
const detailCache = createCacheHelpers(DETAIL_CACHE_KEY);

export async function fetchBookDetail(bookId, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = detailCache.get(bookId);
    if (cached) {
      debug('fetchBookDetail cache hit', bookId);
      return cached;
    }
  }

  const url = `${getApiBase()}/api/detail?book_id=${bookId}`;
  debug('fetchBookDetail', bookId, forceRefresh ? '(force refresh)' : '');
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error('Failed to fetch book detail');
  const json = await res.json();
  if (json.code !== 200) throw new Error('Failed to fetch book detail');
  const d = json.data?.data ?? {};
  const result = {
    abstract: d.abstract ?? '',
    author: d.author ?? '',
    audio_thumb_uri: d.audio_thumb_uri ?? '',
    book_name: d.book_name ?? '',
  };
  detailCache.set(bookId, result);
  return result;
}

export async function fetchBook(bookId, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = directoryCache.get(bookId);
    if (cached) {
      debug('fetchBook cache hit', bookId);
      return cached;
    }
  }

  const url = `${getApiBase()}/api/directory?book_id=${bookId}`;
  debug('fetchBook', bookId, forceRefresh ? '(force refresh)' : '');
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error('Failed to fetch book data');
  const json = await res.json();
  if (json.code !== 200) throw new Error('Failed to fetch book data');
  const { lists } = json.data || {};
  const itemDataList = (lists || []).map((item) => ({
    item_id: item.item_id,
    title: item.title,
    version: item.version,
    chapter_word_number: item.chapter_word_number ?? null,
  }));
  const result = {
    data: {
      data: {
        data: {
          book_info: {},
          item_data_list: itemDataList,
        },
      },
    },
  };
  directoryCache.set(bookId, result);
  return result;
}

function applyChapterConversion(result) {
  const content = result?.data?.data?.content ?? '';
  return {
    ...result,
    data: {
      ...result.data,
      data: {
        ...result.data?.data,
        content: maybeConvert(content),
      },
    },
  };
}

export async function fetchItem(itemId, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = chapterCache.get(itemId);
    if (cached) {
      debug('fetchItem cache hit', itemId);
      return applyChapterConversion(cached);
    }
  }

  // API 參數 tab 使用簡體「小说」，後端可能依此識別
  const url = `${getApiBase()}/api/content?tab=小说&item_id=${itemId}`;
  debug('fetchItem', itemId, forceRefresh ? '(force refresh)' : '');
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error('Failed to fetch chapter content');
  const json = await res.json();
  if (json.code !== 200) throw new Error('Failed to fetch chapter content');
  const content = json.data?.content ?? '';
  const filteredContent = stripHtmlTagsAndNewlines(content);
  const result = {
    data: {
      data: {
        content: filteredContent,
        novel_data: null,
      },
    },
  };
  chapterCache.set(itemId, result);
  return applyChapterConversion(result);
}
