import { Grid, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CheckMissingInfo = (legalName, phone, altPhone, address, name, email, locations, services) => {
  const navigate = useNavigate();

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    return (
      <Grid container flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} spacing={3} sx={{ height: '100vh' }}>
        <Grid size={5}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'start', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Infomration missing:</Typography>
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
          <Button variant="outlined" onClick={() => navigate('/login')}>
            Login to Add Missing Imformation
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (locations.length === 0) {
    return (
      <Grid container spacing={3}>
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
          <Button variant="outlined" onClick={() => navigate('/login')}>
            Add Locations
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (services.length === 0) {
    return (
      <Grid container spacing={3}>
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
          <Button variant="outlined" onClick={() => navigate('/login')}>
            Add Services
          </Button>
        </Grid>
      </Grid>
    );
  }
};

export default CheckMissingInfo;
