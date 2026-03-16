import { UserOutlined } from '@ant-design/icons';

const icons = {
  UserOutlined
};

const poStaffs = {
  title: 'PO Staffs',
  type: 'group',
  children: [
    {
      title: 'All Staffs',
      type: 'item',
      url: '/po/dashboard/staffs',
      icon: icons.UserOutlined
    }
  ]
};

export default poStaffs;
