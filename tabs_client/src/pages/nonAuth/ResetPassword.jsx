import { Grid, Stack, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import AuthWrapper from 'sections/auth/AuthWrapper';
import ResetPasswordForm from '../../sections/auth/ResetPasswordForm';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('accountType');
  const token = searchParams.get('token');

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Reset Password</Typography>
            <Typography component={Link} to="/" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              <span sx={{ color: 'blue' }}>My Account</span>
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <ResetPasswordForm token={token} accountType={accountType} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
