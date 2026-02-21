import { NotificationOutlined, QuestionOutlined, VideoCameraOutlined, PlusCircleOutlined } from '@ant-design/icons';

const icons = {
  NotificationOutlined,
  QuestionOutlined,
  VideoCameraOutlined,
  PlusCircleOutlined
};

const notification = {
  title: 'Notification',
  type: 'group',
  children: [
    {
      title: 'Add Announcement',
      type: 'item',
      url: '/dashboard/announcement/add',
      icon: icons.PlusCircleOutlined
    },
    {
      title: 'Announcement',
      type: 'item',
      url: '/dashboard/announcement',
      icon: icons.NotificationOutlined
    }
  ]
};

export default notification;
