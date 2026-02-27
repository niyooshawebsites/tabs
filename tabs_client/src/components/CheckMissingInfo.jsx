import { Grid, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NonAuthWrapper from '../sections/auth/NonAuthWrapper';

const CheckMissingInfo = (legalName, phone, altPhone, address, name, email, locations, services) => {
  const navigate = useNavigate();

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    console.log(legalName, phone, altPhone, address, name, email);
    return (
      <NonAuthWrapper>
        <Grid container flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} spacing={3} sx={{ height: '100vh' }}>
          <Grid size={12}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Infomration missing:</Typography>
            </Stack>
          </Grid>
          <Grid size={12} sx={{ p: 2, backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
            <Typography variant="h6">Get up and running in 3 easy steps:</Typography>
            <Box>
              <ol style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                <li>Update Profile</li>
                <li>Add Locations</li>
                <li>Add Services</li>
              </ol>
            </Box>
            <Button variant="outlined" onClick={() => navigate('/dashboard/settings/profile/update')}>
              Login to Add Missing Imformation
            </Button>
          </Grid>
        </Grid>
      </NonAuthWrapper>
    );
  }

  if (locations.length === 0) {
    return (
      <NonAuthWrapper>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Infomration missing:</Typography>
            </Stack>
          </Grid>
          <Grid size={12} sx={{ p: 2, backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
            <Typography variant="h6">Get up and running in 2 easy steps:</Typography>
            <Box>
              <ol style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                <li>Add Locations</li>
                <li>Add Services</li>
              </ol>
            </Box>
            <Button variant="outlined" onClick={() => navigate('/dashboard/location/add')}>
              Add Locations
            </Button>
          </Grid>
        </Grid>
      </NonAuthWrapper>
    );
  }

  if (services.length === 0) {
    return (
      <NonAuthWrapper>
        <Grid container spacing={3}>
          <Grid size={12} sx={{ p: 2, backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Infomration missing:</Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Typography variant="h6">Get up and running in 1 easy step:</Typography>
            <Box>
              <ol style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                <li>Add Services</li>
              </ol>
            </Box>
            <Button variant="outlined" onClick={() => navigate('/dashboard/service/add')}>
              Add Services
            </Button>
          </Grid>
        </Grid>
      </NonAuthWrapper>
    );
  }
};

export default CheckMissingInfo;
