import { Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
// import moment from 'moment';

const headCells = [
  {
    id: 'ID',
    align: 'left',
    disablePadding: false,
    label: 'Tenant ID'
  },
  {
    id: 'username',
    align: 'left',
    disablePadding: true,
    label: 'Username'
  },
  {
    id: 'profession',
    align: 'left',
    disablePadding: false,
    label: 'Profession'
  },
  {
    id: 'totalAppointments',
    align: 'left',
    disablePadding: false,
    label: 'Appts'
  },
  {
    id: 'totalClients',
    align: 'left',
    disablePadding: false,
    label: 'Clients'
  },
  {
    id: 'planName',
    align: 'left',
    disablePadding: false,
    label: 'Plan name'
  },
  {
    id: 'PlanPrice',
    align: 'left',
    disablePadding: false,
    label: 'Plan price'
  },
  {
    id: 'moreInfo',
    align: 'left',
    disablePadding: false,
    label: 'More info'
  }
];

function OrderTableHead({ order, orderBy }) {
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

export default function TenantsTable({ tenants, handlePrev, handleNext, fetchTenantDetails, fetchTenantAppointments, page, pagination }) {
  // const { role, isAuthenticated } = useSelector((state) => state.login_slice);
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
        {tenants.length > 0 ? (
          <>
            {' '}
            <Table aria-labelledby="tableTitle">
              <OrderTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {tenants.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row._id}>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row._id}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.username}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.profession}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.totalAppointments}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.totalClients}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.plan?.name}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.plan?.price}</span>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                      >
                        <Link color="secondary" onClick={() => fetchTenantAppointments(row._id)}>
                          <SpeakerNotesIcon color="primary" sx={{ cursor: 'pointer' }} />
                        </Link>
                        <Link color="secondary" onClick={() => fetchTenantDetails(row._id)} sx={{ cursor: 'pointer' }}>
                          <InfoOutlineIcon color="primary" />
                        </Link>
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
          <Box sx={{ p: 1 }}>No Tenants</Box>
        )}
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
