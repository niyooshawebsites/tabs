import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AppCard from './AppCard';
import AuthBackground from './AuthBackground';
import { useState } from 'react';
import { Link } from 'react-router';
import AppointmentSearchNonAuthModal from '../../components/AppointmentSearchNonAuthModal';
import detectSubDomain from './TenantDetails';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { adminSliceActions } from '../../store/slices/AdminSlice';
import TenantDetails from './TenantDetails';

export default function NonAuthWrapper({ children }) {
  const subDomain = detectSubDomain();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const fetchAdminDetails = async () => {
  //   try {
  //     if (subDomain) {
  //       const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-admin-details?username=${subDomain}`, {
  //         withCredentials: true
  //       });

  //       if (data.success) {
  //         dispatch(
  //           adminSliceActions.captureAdminDetails({
  //             id: data.data?._id,
  //             legalName: data.data?.legalName,
  //             gstNo: data.data?.gstNo,
  //             name: data.data?.name,
  //             isDoctor: data.data?.isDoctor,
  //             experience: data.data?.experience,
  //             proffessinalCourse: data.data?.proffessinalCourse,
  //             phone: data.data?.phone,
  //             altPhone: data.data?.altPhone,
  //             email: data.data?.email,
  //             address: data.data?.address,
  //             tenantId: data.data?.tenant,
  //             workingDays: data.data?.workingDays,
  //             timings: data.data?.timings
  //           })
  //         );
  //       }
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
  //       console.log(errorMessage);
  //       toast.error('Profile is not updated');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (subDomain) {
  //     fetchAdminDetails();
  //   }
  // }, [subDomain]);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <TenantDetails />
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

            {subDomain ? (
              <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none', mx: 2 }} color="primary">
                Login
              </Typography>
            ) : (
              <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none', mx: 2 }} color="primary">
                Register
              </Typography>
            )}
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
