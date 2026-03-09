import { chapterCache } from './cache';
import { maybeConvert } from './zh-convert';
import { getChapterTitle } from './chapter-helpers';

/**
 * Builds and downloads a book_id.txt file with book metadata and cached chapter content.
 * @param {Object} params
 * @param {string} params.bookId - Book ID
 * @param {Object} params.bookInfo - Book info (book_info.original_book_name, author, abstract)
 * @param {Array<{item_id: string, title: string}>} params.itemDataList - Chapter list
 * @param {boolean} [params.useTraditionalChinese] - Whether to convert content to traditional Chinese
 * @returns {Promise<{ exportedCount: number }>} Number of chapters exported; 0 if none were cached
 */
export async function exportBookToTxt({ bookId, bookInfo, itemDataList, useTraditionalChinese = false }) {
  if (!bookId || !bookInfo || !itemDataList?.length) return { exportedCount: 0 };

  const bookInfoData = bookInfo?.book_info || bookInfo;
  const bookName = maybeConvert(bookInfoData.original_book_name, useTraditionalChinese);
  const author = maybeConvert(bookInfoData.author, useTraditionalChinese);
  const abstract = maybeConvert(bookInfoData.abstract, useTraditionalChinese);

  const lines = [
    bookName,
    `作者：${author}`,
    '',
    '簡介',
    '────',
    abstract || '（無簡介）',
    '',
    '正文',
    '═══════════════════════════════════════',
    '',
  ];

  let exportedCount = 0;
  for (const item of itemDataList) {
    const content = await chapterCache.get(item.item_id);
    if (content == null || typeof content !== 'string') continue;

    const converted = maybeConvert(content, useTraditionalChinese);
    const chapterTitle = maybeConvert(getChapterTitle(item), useTraditionalChinese);

    lines.push(chapterTitle);
    lines.push('');
    lines.push(converted.trim());
    lines.push('');
    exportedCount += 1;
  }

  if (exportedCount === 0) return { exportedCount: 0 };

  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (bookName || '').replace(/[<>:"/\\|?*]/g, '_').trim().slice(0, 200) || bookId;
  a.download = `${safeName}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  return { exportedCount };
}
