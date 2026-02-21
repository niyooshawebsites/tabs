// assets
import { VideoCameraOutlined } from '@ant-design/icons';

// icons
const icons = {
  VideoCameraOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const support = {
  title: 'Support',
  type: 'group',
  children: [
    {
      title: 'Tutorial',
      type: 'item',
      url: 'https://youtube.com',
      icon: icons.VideoCameraOutlined,
      target: true
    }
  ]
};

export default support;
