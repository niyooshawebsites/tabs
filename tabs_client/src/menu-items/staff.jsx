// assets
import { LoginOutlined, ProfileOutlined, PlusCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  PlusCircleOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const staff = {
  id: 'authentication',
  title: 'Staff',
  type: 'group',
  children: [
    {
      title: 'Create Staff',
      type: 'item',
      url: '/dashboard/staff/create',
      icon: icons.PlusCircleOutlined,
      target: false
    },
    {
      title: 'All Staff',
      type: 'item',
      url: '/dashboard/staff',
      icon: icons.ProfileOutlined,
      target: false
    }
  ]
};

export default staff;
