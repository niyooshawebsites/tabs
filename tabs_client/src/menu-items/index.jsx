// project import
import dashboard from './dashboard';
import appointments from './appointments';
import services from './services';
import notification from './notification';
import clients from './clients';
import support from './support';
import staff from './staff';
import location from './location';
import poDashboard from './poDashboard';
import poStaffs from './poStaffs';
import poTenants from './poTenants';
import poClients from './poClients';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [poDashboard, poTenants, poStaffs, poClients, dashboard, appointments, services, location, staff, clients, notification, support]
};

export default menuItems;
