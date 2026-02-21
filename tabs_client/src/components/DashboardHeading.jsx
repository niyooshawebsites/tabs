import { Typography } from '@mui/material';

const DashboardHeading = ({ title }) => {
  return (
    <Typography
      variant="body1"
      sx={{
        fontSize: 20,
        fontWeight: 'bold',
        textDecoration: 'none',
        alignSelf: 'center',
        cursor: 'pointer'
      }}
    >
      {title}
    </Typography>
  );
};

export default DashboardHeading;
