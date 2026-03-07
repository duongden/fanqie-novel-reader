import React, { createContext, useContext, useCallback, useReducer, useRef, useEffect } from 'react';
import { fetchItem } from '../services/api';
import { MAX_CONCURRENT_DOWNLOADS } from '../utils/constants';
import { isChapterCached } from '../utils/storage';

const DownloadManagerContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        downloading: new Set([...state.downloading, action.itemId]),
      };
    case 'END':
      return {
        ...state,
        downloading: (() => {
          const next = new Set(state.downloading);
          next.delete(action.itemId);
          return next;
        })(),
      };
    case 'START_DOWNLOAD_ALL':
      return {
        ...state,
        downloadAllBookId: action.bookId,
        downloadAllItemIds: action.itemIds,
      };
    case 'STOP_DOWNLOAD_ALL':
      return {
        ...state,
        downloadAllBookId: null,
        downloadAllItemIds: [],
      };
    default:
      return state;
  }
}

export function DownloadManagerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { 
    downloading: new Set(),
    downloadAllBookId: null,
    downloadAllItemIds: [],
  });
  const queueRef = useRef([]);
  const activeCountRef = useRef(0);

  const processQueue = useCallback(() => {
    const queue = queueRef.current;
    while (activeCountRef.current < MAX_CONCURRENT_DOWNLOADS && queue.length > 0) {
      const task = queue.shift();
      if (!task) break;
      const { itemId, forceRefresh } = task;
      if (state.downloading.has(itemId)) continue;
      activeCountRef.current += 1;
      dispatch({ type: 'START', itemId });
      fetchItem(itemId, { forceRefresh })
        .then(() => {})
        .catch((err) => console.error('Chapter download failed:', itemId, err))
        .finally(() => {
          activeCountRef.current -= 1;
          dispatch({ type: 'END', itemId });
          processQueue();
        });
    }
  }, [state.downloading]);

  const addToQueue = useCallback((itemId, forceRefresh = false) => {
    if (!itemId) return;
    if (state.downloading.has(itemId)) return;
    const queue = queueRef.current;
    const existing = queue.find((t) => t.itemId === itemId);
    if (existing) {
      existing.forceRefresh = existing.forceRefresh || forceRefresh;
      return;
    }
    queue.push({ itemId, forceRefresh });
    processQueue();
  }, [state.downloading, processQueue]);

  const isDownloading = useCallback(
    (itemId) => state.downloading.has(itemId),
    [state.downloading]
  );

  const startDownloadAll = useCallback((bookId, itemIds) => {
    if (!bookId || !itemIds || itemIds.length === 0) return;
    dispatch({ type: 'START_DOWNLOAD_ALL', bookId, itemIds });
    const batch = itemIds.slice(0, MAX_CONCURRENT_DOWNLOADS);
    batch.forEach((itemId) => addToQueue(itemId, false));
  }, [addToQueue]);

  const stopDownloadAll = useCallback(() => {
    dispatch({ type: 'STOP_DOWNLOAD_ALL' });
  }, []);

  const isDownloadingAll = useCallback((bookId) => {
    return state.downloadAllBookId === bookId;
  }, [state.downloadAllBookId]);

  useEffect(() => {
    if (!state.downloadAllBookId || state.downloadAllItemIds.length === 0) return;

    const uncachedItems = state.downloadAllItemIds.filter((id) => !isChapterCached(id));
    if (uncachedItems.length === 0) {
      dispatch({ type: 'STOP_DOWNLOAD_ALL' });
      return;
    }

    const currentlyDownloading = uncachedItems.some((id) => state.downloading.has(id));
    if (!currentlyDownloading) {
      const batch = uncachedItems.slice(0, MAX_CONCURRENT_DOWNLOADS);
      batch.forEach((itemId) => addToQueue(itemId, false));
    }
  }, [state.downloadAllBookId, state.downloadAllItemIds, state.downloading, addToQueue]);

  const value = {
    downloading: state.downloading,
    addToQueue,
    isDownloading,
    startDownloadAll,
    stopDownloadAll,
    isDownloadingAll,
  };

  return (
    <DownloadManagerContext.Provider value={value}>
      {children}
    </DownloadManagerContext.Provider>
  );
}

export function useDownloadManager() {
  const ctx = useContext(DownloadManagerContext);
  if (!ctx) throw new Error('useDownloadManager must be used within DownloadManagerProvider');
  return ctx;
}
