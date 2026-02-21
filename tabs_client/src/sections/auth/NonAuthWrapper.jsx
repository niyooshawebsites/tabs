import PropTypes from 'prop-types';
import { Grid, Box, Typography, Button } from '@mui/material';
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AppCard from './AppCard';
// import { useNavigate } from 'react-router';
import AuthBackground from './AuthBackground';
import { useState } from 'react';
import { Link } from 'react-router';
// import { useSelector, useDispatch } from 'react-redux';
import AppointmentSearchNonAuthModal from '../../components/AppointmentSearchNonAuthModal';
// import { tenantSliceActions } from '../../store/slices/TenantSlice';
// import { serviceSliceActions } from '../../store/slices/ServiceSlice';
// import { announcementSliceActions } from '../../store/slices/AnnouncementSlice';
// import { locationSliceActions } from '../../store/slices/LocationSlice';
// import detectSubDomain from '../../utils/detectSubDomain';
// import { toast } from 'react-toastify';
// import axios from 'axios';

const hostname = window.location.hostname;

export default function NonAuthWrapper({ children }) {
  // const subDomain = detectSubDomain();
  // const { page, limit } = useSelector((state) => state.service_slice);
  // const { tenantId } = useSelector((state) => state.tenant_slice);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const fetchTenantDetails = async () => {
  //   try {
  //     const { data } = await axios.get(`${import.meta.env.VITE_API_URL}does-tenant-exist?username=${subDomain}`, {
  //       withCredentials: true
  //     });

  //     if (data.success) {
  //       console.log(subDomain);
  //       console.log(data || 'Not found Tenant');
  //       dispatch(
  //         tenantSliceActions.captureTenantDetails({
  //           tenantId: data?.data?.id
  //         })
  //       );
  //     }

  //     if (!data.success) {
  //       toast.error('You are not registered with us. Register first.');
  //       navigate('/register');
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //     const errorData = err.response?.data;

  //     if (errorData?.errors && Array.isArray(errorData.errors)) {
  //       // Multiple validation errors (Zod)
  //       errorData.errors.forEach((msg) => toast.error(msg));
  //     } else {
  //       // Generic error
  //       const errorMessage = errorData?.message || 'Something went wrong';
  //       console.log(errorMessage);
  //     }
  //   }
  // };

  // const fetchAllLocations = async () => {
  //   try {
  //     const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=${page}&limit=${limit}&uid=${tenantId}`, {
  //       withCredentials: true
  //     });

  //     if (data.success) {
  //       dispatch(
  //         locationSliceActions.captureLocationDetails({
  //           locations: data?.data,
  //           totalLocations: data?.pagination?.totalLocations,
  //           totalPages: data?.pagination?.totalPages,
  //           hasNextPage: data?.pagination?.hasNextPage,
  //           hasPrevPage: data?.pagination?.hasPrevPage,
  //           limit: data?.pagination?.limit,
  //           page: data?.pagination?.page
  //         })
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     const errorData = err.response?.data;

  //     if (errorData?.errors && Array.isArray(errorData.errors)) {
  //       // Multiple validation errors (Zod)
  //       errorData.errors.forEach((msg) => toast.error(msg));
  //     } else {
  //       // Generic error
  //       const errorMessage = errorData?.message || 'Something went wrong';
  //       toast.error(errorMessage);
  //     }
  //   }
  // };

  // const fetchAllServices = async () => {
  //   try {
  //     const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-services?page=${page}&limit=${limit}&uid=${tenantId}`, {
  //       withCredentials: true
  //     });
  //     if (data.success) {
  //       dispatch(
  //         serviceSliceActions.captureServiceDetails({
  //           services: data?.data,
  //           totalServices: data?.pagination?.totalServices,
  //           totalPages: data?.pagination?.totalPages,
  //           hasNextPage: data?.pagination?.hasNextPage,
  //           hasPrevPage: data?.pagination?.hasPrevPage,
  //           limit: data?.pagination?.limit,
  //           page: data?.pagination?.page
  //         })
  //       );
  //     }
  //   } catch (err) {
  //     const errorData = err.response?.data;
  //     if (errorData?.errors) errorData.errors.forEach((msg) => toast.error(msg));
  //     else toast.error(errorData?.message || 'Something went wrong');
  //   }
  // };

  // const fetchAnnouncement = async () => {
  //   try {
  //     const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-announcement?uid=${tenantId}`, { withCredentials: true });
  //     if (data.success) {
  //       dispatch(
  //         announcementSliceActions.captureAnnouncementDetails({
  //           announcement: data?.announcement
  //         })
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   if (subDomain) {
  //     fetchTenantDetails();

  //     if (tenantId !== null) {
  //       fetchAllLocations();
  //       fetchAllServices();
  //       fetchAnnouncement();
  //     }
  //   }
  // }, [subDomain, tenantId]);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AuthBackground />
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', px: 3, mt: 3 }}>
          <Logo to="/" />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Button size="small" color={'primary'} variant={'outlined'} onClick={() => setIsModalOpen(true)}>
              Search Appointment
            </Button>
            <AppointmentSearchNonAuthModal
              isOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Search Appointment"
            />
            <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none', mx: 2 }} color="primary">
              Login
            </Typography>
            {hostname == `${import.meta.env.VITE_FRONTEND_URL}` ? (
              <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none', mx: 2 }} color="primary">
                Register
              </Typography>
            ) : null}
          </Box>
        </Box>
        <Grid size={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 132px)' } }}
          >
            <Grid>
              <AppCard>{children}</AppCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ p: 3 }} size={12}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Box>
  );
}

NonAuthWrapper.propTypes = { children: PropTypes.node };
