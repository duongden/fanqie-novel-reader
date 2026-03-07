import { useState, useCallback, useEffect } from 'react';
import { fetchItem } from '../api';
import { fetchBookDetailAndDirectory } from '../utils/api-helpers';
import { buildNovelDataFromDirectory } from '../utils/chapter-helpers';
import { setLastReadChapter } from '../utils/storage';
import { formatErrorMessage } from '../utils/errors';

export function useChapterLoader(itemId, bookId) {
  const [error, setError] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadChapter = useCallback((forceRefresh = false) => {
    if (!itemId) return;
    
    setLoading(true);
    setError(null);

    const loadPromise = bookId
      ? Promise.all([
          fetchItem(itemId, { forceRefresh }),
          fetchBookDetailAndDirectory(bookId, { forceRefresh: false }),
        ]).then(([contentRes, mergedBookInfo]) => {
          const contentData = contentRes.data.data;
          const novelData = buildNovelDataFromDirectory(itemId, bookId, mergedBookInfo.item_data_list);
          return {
            chapterData: { ...contentData, novel_data: novelData },
            bookInfo: mergedBookInfo,
          };
        })
      : fetchItem(itemId, { forceRefresh }).then((response) => ({
          chapterData: response.data.data,
          bookInfo: null,
        }));

    loadPromise
      .then(({ chapterData: data, bookInfo: info }) => {
        setChapterData(data);
        setBookInfo(info);
        if (bookId && itemId) {
          setLastReadChapter(bookId, itemId);
        }
      })
      .catch((err) => {
        console.error('獲取章節內容失敗:', err);
        const msg = formatErrorMessage(
          err,
          '獲取章節內容失敗，來到沒有內容的荒原，請返回目錄重試！'
        );
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [itemId, bookId]);

  useEffect(() => {
    if (itemId) loadChapter(false);
  }, [itemId, loadChapter]);

  return {
    error,
    chapterData,
    bookInfo,
    loading,
    loadChapter,
  };
}
