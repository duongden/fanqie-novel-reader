import { useNavigate, useLocation } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { IconButton } from './IconButton';

export const ANNOUNCEMENT_BUTTON_TITLE = '前往公告';

function AnnouncementButton({ title = ANNOUNCEMENT_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disabled = disabledProp ?? pathname === '/announcements';

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => navigate('/announcements')}
    >
      <Megaphone size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default AnnouncementButton;
