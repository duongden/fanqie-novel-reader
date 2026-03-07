import React from 'react';
import styled from 'styled-components';
import { BookOpen } from 'lucide-react';
import SavedBookCard from './SavedBookCard';
import { getLastReadChapter, getReadingHistory } from '../utils/storage';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

function ReadingHistory({ refreshKey, onBookClick, onCatalogClick, onCommentClick, onDeleteClick, useTraditionalChinese }) {
  const readingHistory = getReadingHistory();

  if (readingHistory.length === 0) {
    return null;
  }

  return (
    <Section key={refreshKey}>
      <SectionTitle><BookOpen /> 閱讀歷史</SectionTitle>
      {readingHistory.map(({ bookId }) => {
        const lastReadItemId = getLastReadChapter(bookId);
        const actionHint = lastReadItemId ? '繼續閱讀 →' : '前往目錄 →';

        return (
          <SavedBookCard
            key={bookId}
            bookId={bookId}
            actionHint={actionHint}
            onClick={() => onBookClick(bookId)}
            onCatalogClick={(e) => onCatalogClick(e, bookId)}
            onCommentClick={(e) => onCommentClick?.(e, bookId)}
            onDeleteClick={onDeleteClick}
            useTraditionalChinese={useTraditionalChinese}
          />
        );
      })}
    </Section>
  );
}

export default ReadingHistory;
