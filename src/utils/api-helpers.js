import { fetchBookDirectory, fetchBookDetail } from '../api';

export async function fetchBookDetailAndDirectory(bookId, { forceRefresh = false, catalogOnly = false } = {}) {
  const refreshDirectory = forceRefresh;
  const refreshDetail = forceRefresh && !catalogOnly;
  const [bookRes, detail] = await Promise.all([
    fetchBookDirectory(bookId, { forceRefresh: refreshDirectory }),
    fetchBookDetail(bookId, { forceRefresh: refreshDetail }).catch(() => ({}))
  ]);
  
  const bookData = bookRes.data.data.data;
  return {
    ...bookData,
    book_info: { ...bookData.book_info, ...detail },
  };
}
