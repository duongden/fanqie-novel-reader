import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { X, Languages } from 'lucide-react';
import Menu from '../components/Menu';
import Info from '../components/Info';
import Error from '../components/Error';
import MyHead from '../components/MyHead';
import Sort from '../components/Sort';
import LoadingPage from '../components/LoadingPage';
import BackButton from '../components/BackButton';
import styled from 'styled-components';
import { BOOK_ID_KEY } from '../utils/constants';
import { safeSetItem, getLastReadChapter, getUseTraditionalChinese, setUseTraditionalChinese } from '../utils/storage';
import { formatErrorMessage } from '../utils/errors';
import { fetchBookWithDetail } from '../utils/api-helpers';

const BackBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
    border-color: var(--accent-color);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const lastReadItemId = bookId ? getLastReadChapter(bookId) : null;
  const [error, setError] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [useTraditionalChinese, setUseTraditionalChineseState] = useState(getUseTraditionalChinese);

  const loadBook = useCallback((forceRefresh = false) => {
    if (!bookId) return;
    fetchBookWithDetail(bookId, { forceRefresh })
      .then((merged) => {
        setBookInfo(merged);
        safeSetItem(BOOK_ID_KEY, bookId);
      })
      .catch((err) => {
        console.error('獲取圖書資訊失敗：', err);
        const msg = formatErrorMessage(
          err,
          '獲取圖書資訊失敗，請檢查<span>bookId</span>是否正確，或者稍後再試。'
        );
        setError(msg);
      });
  }, [bookId]);

  useEffect(() => {
    if (bookId) loadBook(false);
  }, [bookId, loadBook]);

  const handleTraditionalChineseToggle = useCallback(() => {
    const next = !useTraditionalChinese;
    setUseTraditionalChinese(next);
    setUseTraditionalChineseState(next);
  }, [useTraditionalChinese]);

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(newSortOrder);
  };

  if (!bookId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <MyHead bookInfo={bookInfo} />
      {error && <Error message={error} href="/" />}
      <BackBar>
        <BackButton />
        <RightActions>
          <IconButton
            type="button"
            title={useTraditionalChinese ? '切換為簡體中文' : '切換為繁體中文'}
            onClick={handleTraditionalChineseToggle}
            style={useTraditionalChinese ? { color: 'var(--accent-color)' } : undefined}
          >
            <Languages size={20} strokeWidth={2.5} />
          </IconButton>
          {lastReadItemId && (
            <CloseButton
              type="button"
              onClick={() => navigate(`/chapter?bookId=${bookId}&itemId=${lastReadItemId}`)}
              title="返回章節"
            >
              <X size={20} strokeWidth={2} />
              關閉
            </CloseButton>
          )}
        </RightActions>
      </BackBar>
      {bookInfo ? (
        <>
          <Info bookInfo={bookInfo} useTraditionalChinese={useTraditionalChinese} />
          {bookInfo.item_data_list && (
            <>
              <Sort sortOrder={sortOrder} onSortChange={handleSortChange} />
              <Menu sortOrder={sortOrder} itemDataList={bookInfo.item_data_list} bookId={bookId} useTraditionalChinese={useTraditionalChinese} />
            </>
          )}
        </>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
}

export default Catalog;
