import { useSearchParams, Navigate } from 'react-router-dom';
import NavPageLayout from '../components/common/NavPageLayout';
import Content from '../components/home/Content';
import Header from '../components/home/Header';
import { buildCatalogUrl } from '../utils/navigation';

function Home() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <NavPageLayout>
      <Header />
      <Content />
    </NavPageLayout>
  );
}

export default Home;
