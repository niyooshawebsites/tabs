import { Grid, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CheckMissingInfo = ({ id, locations, services }) => {
  const navigate = useNavigate();
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { role } = useSelector((state) => state.login_slice);

  if (role == 1 || role == 2) {
    if (!id) {
      return (
        <Grid
          container
          flex
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'center'}
          spacing={3}
          sx={{ height: '100vh', marginTop: '50px' }}
        >
          <Grid size={5}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Information missing:</Typography>
            </Stack>
          </Grid>
          <Grid size={5} sx={{ p: 2, backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
            <Typography variant="h6">Get up and running in 3 easy steps:</Typography>
            <Box>
              <ol style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                <li>Update Profile</li>
                <li>Add Locations</li>
                <li>Add Services</li>
              </ol>
            </Box>
            <Button variant="outlined" onClick={() => (tenantId ? navigate(`/dashboard/settings/profile/update`) : navigate(`/login`))}>
              Add Missing Imformation
            </Button>
          </Grid>
        </Grid>
      );
    }

    if (locations == 0) {
      return (
        <Grid container flex flexDirection={'column'} justifyContent={'start'} alignItems={'center'} spacing={3} sx={{ height: '100vh' }}>
          <Grid size={5}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Infomration missing:</Typography>
            </Stack>
          </Grid>
          <Grid size={5} sx={{ p: 2, backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
            <Typography variant="h6">Get up and running in 2 easy steps:</Typography>
            <Box>
              <ol style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                <li>Add Locations</li>
                <li>Add Services</li>
              </ol>
            </Box>
            <Button variant="outlined" onClick={() => (tenantId ? navigate(`/dashboard/location/add`) : navigate(`/login`))}>
              Add Missing Imformation
            </Button>
          </Grid>
        </Grid>
      );
    }

    if (services == 0) {
      return (
        <Grid container flex flexDirection={'column'} justifyContent={'start'} alignItems={'center'} spacing={3} sx={{ height: '100vh' }}>
          <Grid size={5} sx={{ p: 2, backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Infomration missing:</Typography>
            </Stack>
          </Grid>
          <Grid size={5}>
            <Typography variant="h6">Get up and running in 1 easy step:</Typography>
            <Box>
              <ol style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                <li>Add Services</li>
              </ol>
            </Box>
            <Button variant="outlined" onClick={() => (tenantId ? navigate(`/dashboard/service/add`) : navigate(`/login`))}>
              Add Missing Imformation
            </Button>
          </Grid>
        </Grid>
      );
    }
  }

  return null;
};

export default CheckMissingInfo;
