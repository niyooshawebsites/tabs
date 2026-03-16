import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const poDashboard = {
  id: 'group-dashboard',
  title: 'Po Dashboard',
  type: 'group',
  children: [
    {
      id: 'poDashboard',
      title: 'Po Dashboard',
      type: 'item',
      url: '/po/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default poDashboard;
