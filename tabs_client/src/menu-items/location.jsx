// assets
import { LoginOutlined, ProfileOutlined, PlusCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  PlusCircleOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const location = {
  id: 'authentication',
  title: 'Location',
  type: 'group',
  children: [
    {
      title: 'Add Location',
      type: 'item',
      url: '/dashboard/location/add',
      icon: icons.PlusCircleOutlined,
      target: false
    },
    {
      title: 'All Locations',
      type: 'item',
      url: '/dashboard/locations',
      icon: icons.ProfileOutlined,
      target: false
    }
  ]
};

export default location;
