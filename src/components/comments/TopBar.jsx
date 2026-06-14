import React from 'react';
import { RefreshCw } from 'lucide-react';
import TopBarBase from '../common/TopBarBase';
import HomeButton, { HOME_BUTTON_TITLE } from '../common/HomeButton';
import BookshelfButton, { BOOKSHELF_BUTTON_TITLE } from '../common/BookshelfButton';
import CatalogButton, { CATALOG_BUTTON_TITLE } from '../common/CatalogButton';
import ApiDropdown, { API_DROPDOWN_TITLE } from '../common/ApiDropdown';
import LangDropdown, { LANG_DROPDOWN_TITLE } from '../common/LangDropdown';
import { IconButton } from '../common/IconButton';

function TopBar({ bookId, conversionMode, onConversionModeChange, onRefresh }) {
  return (
    <TopBarBase pageTitle="評論">
      <HomeButton title={HOME_BUTTON_TITLE} />
      <BookshelfButton title={BOOKSHELF_BUTTON_TITLE} />
      <ApiDropdown title={API_DROPDOWN_TITLE} />
      <LangDropdown title={LANG_DROPDOWN_TITLE} value={conversionMode} onChange={onConversionModeChange} />
      <IconButton type="button" title="刷新評論" onClick={onRefresh}>
        <RefreshCw size={20} strokeWidth={2.5} />
      </IconButton>
      <CatalogButton title={CATALOG_BUTTON_TITLE} bookId={bookId} />
    </TopBarBase>
  );
}

export default TopBar;
