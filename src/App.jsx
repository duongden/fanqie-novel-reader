import { Routes, Route } from 'react-router-dom';
import { DownloadManagerProvider } from './contexts/DownloadManager';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Chapter from './pages/Chapter';
import Comments from './pages/Comments';

function App() {
  return (
    <DownloadManagerProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/chapter" element={<Chapter />} />
      <Route path="/comments" element={<Comments />} />
    </Routes>
    </DownloadManagerProvider>
  );
}

export default App;
