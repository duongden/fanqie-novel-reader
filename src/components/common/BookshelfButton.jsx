import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { IconButton } from './IconButton';

export const BOOKSHELF_BUTTON_TITLE = '前往書架';

function BookshelfButton({ title = BOOKSHELF_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disabled = disabledProp ?? pathname === '/bookshelf';

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => navigate('/bookshelf')}
    >
      <BookOpen size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default BookshelfButton;
