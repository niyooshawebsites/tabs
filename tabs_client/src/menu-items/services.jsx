// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined
};

// ==============================|| MENU ITEMS - SERIVCES ||============================== //

const services = {
  title: 'Services',
  type: 'group',
  children: [
    {
      title: 'Add Service',
      type: 'item',
      url: '/dashboard/service/add',
      icon: icons.PlusCircleOutlined
    },
    {
      title: 'All Services',
      type: 'item',
      url: '/dashboard/services',
      icon: icons.UnorderedListOutlined
    }
  ]
};

export default services;
