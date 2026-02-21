import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import moment from 'moment';

export default function Footer() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">&copy; All rights reserved. Copyright &copy; {moment().year()}</Typography>

      <Typography variant="caption">
        &copy; Developed By{' '}
        <Link href="https://niyooshawebsitesllp.in" target="_blank" underline="hover">
          Niyoosha Websites LLP
        </Link>
      </Typography>
    </Stack>
  );
}
