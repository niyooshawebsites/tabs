import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

// export default function Navigation() {
//   const { role } = useSelector((state) => state.login_slice);
//   // const [dashboard, appointments, services, staff, clients, notification, support] = menuItem;

//   if (role === 1) {
//     const navGroups = menuItem.items.map((item) => {
//       switch (item.type) {
//         case 'group':
//           return <NavGroup key={item.id} item={item} />;
//         default:
//           return (
//             <Typography key={item.id} variant="h6" color="error" align="center">
//               Fix - Navigation Group
//             </Typography>
//           );
//       }
//     });
//     return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
//   }

//   if (role === 3) {
//     const staffNavigationMenu = menuItem.items.filter((item) => item !== 'staff' && item !== 'services' && item !== 'notification');
//     const navGroups = staffNavigationMenu.items.map((item) => {
//       switch (item.type) {
//         case 'group':
//           return <NavGroup key={item.id} item={item} />;
//         default:
//           return (
//             <Typography key={item.id} variant="h6" color="error" align="center">
//               Fix - Navigation Group
//             </Typography>
//           );
//       }
//     });

//     return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
//   }
// }

export default function Navigation() {
  const { role } = useSelector((state) => state.login_slice);

  // Helper function to render groups
  const renderGroups = (items) =>
    items.map((item) =>
      item.type === 'group' ? (
        <NavGroup key={item.title} item={item} />
      ) : (
        <Typography key={item.title} variant="h6" color="error" align="center">
          Fix - Navigation Group
        </Typography>
      )
    );

  if (role === 1) {
    // Role 1 sees all menu items
    return <Box sx={{ pt: 2 }}>{renderGroups(menuItem.items)}</Box>;
  }

  if (role === 3) {
    // Role 3: filter out staff, services, notification
    const staffNavigationMenu = menuItem.items.filter(
      (item) => item.title !== 'Staff' && item.title !== 'Services' && item.title !== 'Notification'
    );

    return <Box sx={{ pt: 2 }}>{renderGroups(staffNavigationMenu)}</Box>;
  }

  return null;
}
