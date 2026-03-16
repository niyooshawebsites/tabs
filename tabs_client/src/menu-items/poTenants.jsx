import { UserOutlined } from '@ant-design/icons';

const icons = {
  UserOutlined
};

const poTenants = {
  title: 'PO Tenants',
  type: 'group',
  children: [
    {
      title: 'All Tenants',
      type: 'item',
      url: '/po/dashboard/tenants',
      icon: icons.UserOutlined
    }
  ]
};

export default poTenants;
