import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { deleteBookData, getLastReadChapter } from '../../utils/storage';
import { useTraditionalChineseToggle } from '../../hooks/useTraditionalChineseToggle';
import { maybeConvert } from '../../utils/zh-convert';
import { buildChapterOrCatalogUrl, buildCatalogUrl, buildCommentsUrl } from '../../utils/navigation';
import Bookshelf from './Bookshelf';
import AddBook from './AddBook';
import Help from './Help';
import NoticeBoard from './NoticeBoard';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: calc(40px + env(safe-area-inset-top)) 24px calc(40px + env(safe-area-inset-bottom));
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: calc(24px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom));
  }
`;

function Content() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [useTraditionalChinese, toggleTraditionalChinese] = useTraditionalChineseToggle();

  const handleBookInputSubmit = (bookId) => {
    const lastReadItemId = getLastReadChapter(bookId);
    navigate(buildChapterOrCatalogUrl(bookId, lastReadItemId));
  };

  const handleBookClick = (bookId) => {
    const lastReadItemId = getLastReadChapter(bookId);
    navigate(buildChapterOrCatalogUrl(bookId, lastReadItemId));
  };

  const handleCatalogClick = (e, bookId) => {
    e.stopPropagation();
    navigate(buildCatalogUrl(bookId));
  };

  const handleCommentClick = (e, bookId) => {
    e.stopPropagation();
    navigate(buildCommentsUrl(bookId));
  };

  const handleDeleteBook = async (e, bookId, bookInfo) => {
    e.stopPropagation();
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, useTraditionalChinese) || bookId;
    if (window.confirm(`確定要刪除「${convertedName}」的所有本地資料嗎？`)) {
      await deleteBookData(bookId);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <ContentWrapper>
      <NoticeBoard />
      <Bookshelf
        refreshKey={refreshKey}
        onBookClick={handleBookClick}
        onCatalogClick={handleCatalogClick}
        onCommentClick={handleCommentClick}
        onDeleteClick={handleDeleteBook}
        useTraditionalChinese={useTraditionalChinese}
      />

      <AddBook
        onSubmit={handleBookInputSubmit}
        refreshKey={refreshKey}
        useTraditionalChinese={useTraditionalChinese}
        onTraditionalChineseToggle={toggleTraditionalChinese}
      />

      <Help />
    </ContentWrapper>
  );
}

export default Content;
