import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import { useNavigate } from 'react-router';

export default function SettingTab() {
  const navigate = useNavigate();
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <Link underline="none" sx={{ color: 'inherit' }}>
        <ListItemButton>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Tutorial" onClick={() => window.open('https://www.youtube.com', '_blank')} />
        </ListItemButton>
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Update Password" onClick={() => navigate('/dashboard/settings/password/update')} />
      </ListItemButton>
      <Link underline="none" style={{ color: 'inherit' }}>
        <ListItemButton>
          <ListItemIcon>
            <CommentOutlined />
          </ListItemIcon>
          <ListItemText primary="Support" onClick={() => (window.location.href = 'mailto:niyooshawebsites@gmail.com')} />
        </ListItemButton>
      </Link>
    </List>
  );
}
