import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

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

  if (role === 3) {
    // Role 3 sees all menu items
    const poNavigationMenu = menuItem.items.filter(
      (item) =>
        item.title !== 'Navigation' &&
        item.title !== 'Appoinitments' &&
        item.title !== 'Staff' &&
        item.title !== 'Services' &&
        item.title !== 'Location' &&
        item.title !== 'Clients' &&
        item.title !== 'Notification'
    );
    return <Box sx={{ pt: 2 }}>{renderGroups(poNavigationMenu)}</Box>;
  }

  if (role === 2) {
    // Role 2 sees all menu items
    const tenantNavigationMenu = menuItem.items.filter(
      (item) => item.title !== 'Po Dashboard' && item.title !== 'PO Tenants' && item.title !== 'PO Staffs' && item.title !== 'PO Clients'
    );
    return <Box sx={{ pt: 2 }}>{renderGroups(tenantNavigationMenu)}</Box>;
  }

  if (role === 1) {
    // Role 1: filter out staff, services, notification
    const staffNavigationMenu = menuItem.items.filter(
      (item) =>
        item.title !== 'Staff' &&
        item.title !== 'Services' &&
        item.title !== 'Location' &&
        item.title !== 'Clients' &&
        item.title !== 'Notification'
    );
    return <Box sx={{ pt: 2 }}>{renderGroups(staffNavigationMenu)}</Box>;
  }

  return null;

  //clients
}
