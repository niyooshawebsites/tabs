import PropTypes from 'prop-types';
import { Grid, Box, Typography, Button } from '@mui/material';
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AppCard from './AppCard';
import AuthBackground from './AuthBackground';
import { useState } from 'react';
import { Link } from 'react-router';
import AppointmentSearchNonAuthModal from '../../components/AppointmentSearchNonAuthModal';
import { useSelector } from 'react-redux';

export default function NonAuthWrapper({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subDomain } = useSelector((state) => state.subDomain_slice);

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
