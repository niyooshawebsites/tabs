import { IconButton, Stack, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const Pagination = ({ handlePrev, handleNext, pagination, page }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ padding: '0 10px', backgroundColor: 'gray' }}
    >
      <Typography component="span">Page</Typography>
      <></>

      <Typography component="span">
        <IconButton color="primary" onClick={handlePrev} disabled={!pagination.hasPrevPage} aria-label="Previous page">
          <ArrowBackIos />
        </IconButton>

        <Typography component="span">
          {page} of {pagination.totalPages}
        </Typography>

        <IconButton color="primary" onClick={handleNext} disabled={!pagination.hasNextPage} aria-label="Next page">
          <ArrowForwardIos />
        </IconButton>
      </Typography>
    </Stack>
  );
};

export default Pagination;
