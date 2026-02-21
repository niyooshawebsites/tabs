import { Box, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const headCells = [
  {
    id: 'Staff ID',
    align: 'left',
    disablePadding: false,
    label: 'Staff ID'
  },
  {
    id: 'Name',
    align: 'left',
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'Employee ID',
    align: 'left',
    disablePadding: false,
    label: 'Employee ID'
  },
  {
    id: 'Email ID',
    align: 'left',
    disablePadding: false,
    label: 'Email ID'
  },
  {
    id: 'Service',
    align: 'left',
    disablePadding: false,
    label: 'Service'
  },
  {
    id: 'Location',
    align: 'left',
    disablePadding: false,
    label: 'Location'
  },
  {
    id: 'Action',
    align: 'left',
    disablePadding: false,
    label: 'Action'
  }
];

function StaffTableHead({ order, orderBy }) {
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

export default function StaffTable({ staff, handlePrev, handleNext, editStaff, deleteStaff, pagination, page, deletingAStaff }) {
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
        {staff.length > 0 ? (
          <>
            {' '}
            <Table aria-labelledby="tableTitle">
              <StaffTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {staff.map((row, index) => {
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
                        <span color="secondary">{row?.empId}</span>
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.email}</span>
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">
                          {row?.handlesAllServices
                            ? 'All Services'
                            : row?.services?.length
                              ? row.services.map((s) => s.name).join(', ')
                              : '-'}
                        </span>
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.location.name}</span>
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row">
                        <Grid container direction="row" alignItems="center" gap={2}>
                          <Typography color="primary" sx={{ cursor: 'pointer' }} onClick={() => editStaff(row._id)}>
                            Edit
                          </Typography>

                          <Typography color="error" sx={{ cursor: 'pointer' }} onClick={() => deleteStaff(row._id)}>
                            {deletingAStaff ? 'Deleting...' : 'Delete'}
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
          <Box sx={{ p: 1 }}>No Staff</Box>
        )}
      </TableContainer>
    </Box>
  );
}

StaffTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
