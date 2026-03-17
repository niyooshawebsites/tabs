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
      url: '/dashboard/all-tenants',
      icon: icons.UserOutlined
    }
  ]
};

export default poTenants;
