import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography, keyframes } from '@mui/material';

// Define marquee animation using MUI's keyframes
const marquee = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const Ticker = ({ msg, link, linkText }) => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'orange.100',
        border: '1px solid',
        borderColor: 'orange.300',
        borderRadius: 1,
        overflow: 'hidden',
        px: 2,
        mb: 2
      }}
    >
      <Typography
        component="div"
        sx={{
          whiteSpace: 'nowrap',
          display: 'inline-block',
          animation: `${marquee} 15s linear infinite`,
          color: 'warning.dark',
          py: 1,
          fontSize: '0.875rem',
          fontWeight: 500
        }}
      >
        📢 Notice: {msg}{' '}
        <Link
          component={RouterLink}
          to={link}
          underline="none"
          sx={{
            px: 1.5,
            py: 0.5,
            ml: 1,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'grey.800'
            }
          }}
        >
          {linkText}
        </Link>
      </Typography>
    </Box>
  );
};

export default Ticker;
