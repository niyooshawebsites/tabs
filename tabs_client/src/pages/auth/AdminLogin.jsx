import { Grid, Stack, Typography } from '@mui/material';
import AuthWrapper from 'sections/auth/AuthWrapper';
import ALogin from 'sections/auth/ALogin';

export default function AdminLogin() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <ALogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
