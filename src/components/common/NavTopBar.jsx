import TopBarBase from './TopBarBase';
import HomeButton from './HomeButton';
import BookshelfButton from './BookshelfButton';
import NewBookButton from './NewBookButton';
import AnnouncementButton from './AnnouncementButton';
import ApiDropdown from './ApiDropdown';
import LangDropdown from './LangDropdown';

function NavTopBar({ pageTitle, conversionMode, onConversionModeChange }) {
  return (
    <TopBarBase pageTitle={pageTitle}>
      <HomeButton />
      <BookshelfButton />
      <NewBookButton />
      <AnnouncementButton />
      <ApiDropdown />
      <LangDropdown value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default NavTopBar;
