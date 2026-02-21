import { Box, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const headCells = [
  {
    id: 'Service ID',
    align: 'left',
    disablePadding: false,
    label: 'Service ID'
  },
  {
    id: 'Service name',
    align: 'left',
    disablePadding: false,
    label: 'Service Name'
  },
  {
    id: 'Service Charges',
    align: 'left',
    disablePadding: false,
    label: 'Service Charges'
  },
  {
    id: 'Avg Service Duration (mins)',
    align: 'left',
    disablePadding: false,
    label: 'Avg Service Duration (mins)'
  },
  {
    id: 'Action',
    align: 'left',
    disablePadding: false,
    label: 'Action'
  }
];

function ServiceTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function ServicesTable({ services, handlePrev, handleNext, editService, deleteService, pagination, page, deletingService }) {
  const order = 'asc';
  const orderBy = 'tracking_no';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        {services.length > 0 ? (
          <>
            {' '}
            <Table aria-labelledby="tableTitle">
              <ServiceTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {services.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row._id}>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?._id}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.name}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">&#8377; {row?.charges}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.duration}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Grid container direction="row" alignItems="center" gap={2}>
                          <Typography color="primary" sx={{ cursor: 'pointer' }} onClick={() => editService(row._id)}>
                            Edit
                          </Typography>

                          <Typography color="error" sx={{ cursor: 'pointer' }} onClick={() => deleteService(row._id)}>
                            {deletingService ? 'Deleting...' : 'Delete'}
                          </Typography>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 4 }}>
              <IconButton color="primary" onClick={handlePrev} disabled={!pagination.hasPrevPage} aria-label="Previous page">
                <ArrowBackIos />
              </IconButton>

              <Typography variant="body1">
                Page {page} of {pagination.totalPages}
              </Typography>

              <IconButton color="primary" onClick={handleNext} disabled={!pagination.hasNextPage} aria-label="Next page">
                <ArrowForwardIos />
              </IconButton>
            </Stack>
          </>
        ) : (
          <Box sx={{ p: 1 }}>No Services</Box>
        )}
      </TableContainer>
    </Box>
  );
}

ServiceTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
