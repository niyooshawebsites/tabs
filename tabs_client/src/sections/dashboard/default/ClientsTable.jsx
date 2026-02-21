import { Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import Dot from 'components/@extended/Dot';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import moment from 'moment';

const headCells = [
  {
    id: 'ID',
    align: 'left',
    disablePadding: false,
    label: 'ID.'
  },
  {
    id: 'Name',
    align: 'left',
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'DOB',
    align: 'left',
    disablePadding: false,
    label: 'DOB'
  },
  {
    id: 'Email',
    align: 'left',
    disablePadding: false,
    label: 'Email'
  },
  {
    id: 'Phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone'
  },
  {
    id: 'Appointments',
    align: 'left',
    disablePadding: false,
    label: 'Appointments'
  },
  {
    id: 'Details',
    align: 'left',
    disablePadding: false,
    label: 'Details'
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

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function ClientsTable({ clients, handlePrev, handleNext, fetchClientDetails, fetchClientAppointments, page, pagination }) {
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
        {clients.length > 0 ? (
          <>
            {' '}
            <Table aria-labelledby="tableTitle">
              <OrderTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {clients.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row._id}>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row._id}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.name}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{moment(row?.dob).format('DD-MM-YYYY')}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.email}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <span color="secondary">{row?.phone}</span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Link color="secondary" onClick={() => fetchClientAppointments(row._id)}>
                          <SpeakerNotesIcon color="primary" sx={{ cursor: 'pointer' }} />
                        </Link>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Link color="secondary" onClick={() => fetchClientDetails(row._id)} sx={{ cursor: 'pointer' }}>
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
          <Box sx={{ p: 1 }}>No Clients</Box>
        )}
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
