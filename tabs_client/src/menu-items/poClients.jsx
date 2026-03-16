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
      url: '/po/dashboard/clients',
      icon: icons.UserOutlined
    }
  ]
};

export default poClients;
