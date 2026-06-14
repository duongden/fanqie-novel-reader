import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import Content from '../components/announcement/Content';
import { useConversionMode } from '../hooks/useConversionMode';

function Announcements() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="公告" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Content />
    </NavPageLayout>
  );
}

export default Announcements;
