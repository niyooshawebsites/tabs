import { lazy } from 'react';
import Loadable from 'components/Loadable';
const Home = Loadable(lazy(() => import('../pages/nonAuth/Home')));

const PoDashboardDefault = Loadable(lazy(() => import('pages/dashboard/PoDefault')));
const PoDashboardTenants = Loadable(lazy(() => import('pages/dashboard/AllTenants')));
const PoDashboardStaffs = Loadable(lazy(() => import('pages/dashboard/AllStaffs')));
const PoDashboardClients = Loadable(lazy(() => import('pages/dashboard/AllClients')));

const PoDashboardTenantDetails = Loadable(lazy(() => import('pages/dashboard/PoTenantDetails')));
const PoDashboardTenantAppointmentDetails = Loadable(lazy(() => import('pages/dashboard/PoTenantAppointmentDetails')));
const PoDashboardTenantAppointments = Loadable(lazy(() => import('pages/dashboard/PoTenantAppointments')));
const PoDashboardTenantClients = Loadable(lazy(() => import('pages/dashboard/PoTenantClients')));
const PoDashboardClientAppointments = Loadable(lazy(() => import('pages/dashboard/PoClientAppointments')));

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/Default')));
const DashboardCreateAppointment = Loadable(lazy(() => import('pages/dashboard/CreateAppointment')));
const DashboardAppointments = Loadable(lazy(() => import('pages/dashboard/Appointments')));
const DashboardAddService = Loadable(lazy(() => import('pages/dashboard/AddService')));
const DashboardEditService = Loadable(lazy(() => import('pages/dashboard/EditService')));
const DashboardServices = Loadable(lazy(() => import('pages/dashboard/Services')));
const DashboardClients = Loadable(lazy(() => import('pages/dashboard/Clients')));
const DashboardClientDetails = Loadable(lazy(() => import('pages/dashboard/ClientDetails')));
const DashboardClientAppointments = Loadable(lazy(() => import('pages/dashboard/ClientAppointments')));
const DashboardAddLocation = Loadable(lazy(() => import('pages/dashboard/AddLocation')));
const DashboardLocations = Loadable(lazy(() => import('pages/dashboard/Locations')));
const DashboardEditLocation = Loadable(lazy(() => import('pages/dashboard/EditLocation')));
const DashboardCreateStaff = Loadable(lazy(() => import('pages/dashboard/CreateStaff')));
const DashboardStaff = Loadable(lazy(() => import('pages/dashboard/Staff')));
const DashboardEditStaff = Loadable(lazy(() => import('pages/dashboard/EditStaff')));
const DashboardAppointmentDetails = Loadable(lazy(() => import('pages/dashboard/AppointmentDetails')));
const DashboardAppointmentRemarks = Loadable(lazy(() => import('pages/dashboard/AppointmentRemarks')));
const DashboardAddAnnouncement = Loadable(lazy(() => import('pages/dashboard/AddAnnouncement')));
const DashboardAnnouncement = Loadable(lazy(() => import('pages/dashboard/Announcement')));
const DashboardEditProfile = Loadable(lazy(() => import('pages/dashboard/EditProfile')));
const DashboardViewProfile = Loadable(lazy(() => import('pages/dashboard/ViewProfile')));
const DashboardUpdatePassword = Loadable(lazy(() => import('pages/dashboard/UpdatePassword')));
const DashboardPlan = Loadable(lazy(() => import('pages/dashboard/Plan')));
const Register = Loadable(lazy(() => import('pages/auth/Register')));
const SearchAppointment = Loadable(lazy(() => import('pages/nonAuth/SearchAppointment')));
const NotFound = Loadable(lazy(() => import('pages/nonAuth/NotFound')));
const Login = Loadable(lazy(() => import('pages/auth/Login')));
const PlatformOwnerLogin = Loadable(lazy(() => import('pages/auth/PlatformOwnerLogin')));
const ForgotPassword = Loadable(lazy(() => import('pages/nonAuth/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('pages/nonAuth/ResetPassword')));
const ProtectedRoute = Loadable(lazy(() => import('layout/Dashboard/index')));

const MainRoutes = {
  path: '/',
  children: [
    // Public Routes
    {
      path: '/',
      element: <Home />
    },
    {
      path: 'register',
      element: <Register />
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'login-po',
      element: <PlatformOwnerLogin />
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />
    },
    {
      path: 'reset-password',
      element: <ResetPassword />
    },
    {
      path: 'search/appointment/:aid',
      element: <SearchAppointment />
    },
    {
      path: '*',
      element: <NotFound />
    },

    // Protected Dashboard Routes
    {
      path: 'dashboard',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <DashboardDefault />
        },
        {
          path: 'appointment/create',
          element: <DashboardCreateAppointment />
        },
        {
          path: 'service/add',
          element: <DashboardAddService />
        },
        {
          path: 'service/edit/:sid',
          element: <DashboardEditService />
        },
        {
          path: 'services',
          element: <DashboardServices />
        },
        {
          path: 'appointments',
          element: <DashboardAppointments />
        },
        {
          path: 'appointment/details/:aid',
          element: <DashboardAppointmentDetails />
        },
        {
          path: 'appointment/remarks/:aid',
          element: <DashboardAppointmentRemarks />
        },
        {
          path: 'clients',
          element: <DashboardClients />
        },
        {
          path: 'client/details/:clientInfo',
          element: <DashboardClientDetails />
        },
        {
          path: 'location/add',
          element: <DashboardAddLocation />
        },
        {
          path: 'locations',
          element: <DashboardLocations />
        },
        {
          path: 'location/edit/:lid',
          element: <DashboardEditLocation />
        },
        {
          path: 'staff/create',
          element: <DashboardCreateStaff />
        },
        {
          path: 'staff',
          element: <DashboardStaff />
        },
        {
          path: 'staff/edit/:staffId',
          element: <DashboardEditStaff />
        },
        {
          path: 'client/appointments/:cid',
          element: <DashboardClientAppointments />
        },
        {
          path: 'settings/profile/update',
          element: <DashboardEditProfile />
        },
        {
          path: 'settings/profile',
          element: <DashboardViewProfile />
        },
        {
          path: 'settings/password/update',
          element: <DashboardUpdatePassword />
        },
        {
          path: 'announcement/add',
          element: <DashboardAddAnnouncement />
        },
        {
          path: 'announcement',
          element: <DashboardAnnouncement />
        },
        {
          path: 'plan',
          element: <DashboardPlan />
        },
        {
          path: 'pod',
          element: <PoDashboardDefault />
        },
        {
          path: 'all-tenants',
          element: <PoDashboardTenants />
        },
        {
          path: 'all-staffs',
          element: <PoDashboardStaffs />
        },
        {
          path: 'all-clients',
          element: <PoDashboardClients />
        },
        {
          path: 'tenant/details/:tid',
          element: <PoDashboardTenantDetails />
        },
        {
          path: 'tenant/appointments/:tid',
          element: <PoDashboardTenantAppointments />
        },
        {
          path: 'tenant/:tid/appointment/:aid',
          element: <PoDashboardTenantAppointmentDetails />
        },
        {
          path: 'tenant/clients/:tid',
          element: <PoDashboardTenantClients />
        },
        {
          path: 'client/appointments-for-po/:cid',
          element: <PoDashboardClientAppointments />
        }
      ]
    }
  ]
};

export default MainRoutes;
