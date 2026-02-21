// assets
import { LoginOutlined, ProfileOutlined, PlusCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  PlusCircleOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const appointments = {
  id: 'authentication',
  title: 'Appoinitments',
  type: 'group',
  children: [
    {
      title: 'Create Appointment',
      type: 'item',
      url: '/dashboard/appointment/create',
      icon: icons.PlusCircleOutlined,
      target: false
    },
    {
      title: 'All Appointments',
      type: 'item',
      url: '/dashboard/appointments',
      icon: icons.ProfileOutlined,
      target: false
    }
  ]
};

export default appointments;
