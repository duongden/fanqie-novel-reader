import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { IconButton } from './IconButton';

export const NEW_BOOK_BUTTON_TITLE = '新增書籍';

function NewBookButton({ title = NEW_BOOK_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disabled = disabledProp ?? pathname === '/new-book';

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => navigate('/new-book')}
    >
      <Plus size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default NewBookButton;
