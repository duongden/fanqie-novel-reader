import { useSearchParams, Navigate } from 'react-router-dom';
import Content from '../components/home/Content';
import Footer from '../components/home/Footer';
import Header from '../components/home/Header';
import { getLastReadChapter } from '../utils/storage';
import { buildChapterOrCatalogUrl } from '../utils/navigation';

function Home() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');

  if (bookId) {
    const lastReadItemId = getLastReadChapter(bookId);
    const target = buildChapterOrCatalogUrl(bookId, lastReadItemId);
    return <Navigate to={target} replace />;
  }

  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}

export default Home;
