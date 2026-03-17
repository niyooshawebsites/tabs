import { UserOutlined } from '@ant-design/icons';

const icons = {
  UserOutlined
};

const poClients = {
  title: 'PO Clients',
  type: 'group',
  children: [
    {
      title: 'All Clients',
      type: 'item',
      url: '/dashboard/all-clients',
      icon: icons.UserOutlined
    }
  ]
};

export default poClients;
