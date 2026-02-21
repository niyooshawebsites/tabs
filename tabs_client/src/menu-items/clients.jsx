import { UserOutlined } from '@ant-design/icons';

const icons = {
  UserOutlined
};

const clients = {
  title: 'Clients',
  type: 'group',
  children: [
    {
      title: 'All Clients',
      type: 'item',
      url: '/dashboard/clients',
      icon: icons.UserOutlined
    }
  ]
};

export default clients;
