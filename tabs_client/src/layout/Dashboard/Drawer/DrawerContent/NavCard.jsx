import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';
import { useNavigate } from 'react-router';

export default function NavCard() {
  const navigate = useNavigate();
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack alignItems="center" spacing={2.5}>
        <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
        <Stack alignItems="center">
          <Typography variant="h5">BYA.Online</Typography>
          <Typography variant="h5">Current Plan: Starter</Typography>
          <Typography variant="h5">Appointments: 250/1000</Typography>
          <Typography variant="h5">Clients: 100/500</Typography>
        </Stack>
        <AnimateButton>
          <Button component={Link} variant="contained" color="success" size="small" onClick={() => navigate('/dashboard/plan')}>
            Check Plan Details
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
}
