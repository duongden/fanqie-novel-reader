import { useEffect, useCallback } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import TopBar from '../components/chapter/TopBar';
import BottomBar from '../components/chapter/BottomBar';
import Reader from '../components/chapter/Reader';
import Error from '../components/common/Error';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import PageWrapper from '../components/common/PageWrapper';
import { useTraditionalChineseToggle } from '../hooks/useTraditionalChineseToggle';
import { useFontSize, useFontFamily, useTextBrightness } from '../hooks/useTextSettings';
import { useChapterLoader } from '../hooks/useChapterLoader';
import { buildCatalogUrl } from '../utils/navigation';

function Chapter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('itemId');
  const bookId = searchParams.get('bookId');
  
  const { error, chapterData, bookInfo, loading, loadChapter } = useChapterLoader(itemId, bookId);
  const [fontSize, handleFontSizeChange] = useFontSize();
  const [fontFamily, handleFontFamilyChange] = useFontFamily();
  const [textBrightness, handleTextBrightnessChange] = useTextBrightness();
  const [useTraditionalChinese, toggleTraditionalChinese] = useTraditionalChineseToggle();

  const handleTraditionalChineseToggle = useCallback(() => {
    toggleTraditionalChinese();
    loadChapter(false);
  }, [loadChapter, toggleTraditionalChinese]);

  const handleRefresh = useCallback(() => {
    loadChapter(true);
  }, [loadChapter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  if (!itemId) {
    return bookId ? <Navigate to={buildCatalogUrl(bookId)} replace /> : <Navigate to="/" replace />;
  }

  if (error) {
    return <Error message={error} href={bookId ? buildCatalogUrl(bookId) : '/'} />;
  }

  return (
    <PageWrapper $withBottomPadding={false}>
      {loading ? (
        <Loading onAbort={() => navigate('/')} />
      ) : (
        <>
          <Header bookInfo={bookInfo} chapterData={chapterData} />
          {chapterData && (
            <>
              <TopBar
                chapterData={chapterData}
                bookInfo={bookInfo}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                fontFamily={fontFamily}
                onFontFamilyChange={handleFontFamilyChange}
                textBrightness={textBrightness}
                onTextBrightnessChange={handleTextBrightnessChange}
                useTraditionalChinese={useTraditionalChinese}
                onTraditionalChineseToggle={handleTraditionalChineseToggle}
                onRefresh={handleRefresh}
              />
              <Reader chapterData={chapterData} fontSize={fontSize} fontFamily={fontFamily} textBrightness={textBrightness} />
              <BottomBar chapterData={chapterData} bookId={bookId} />
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default Chapter;
