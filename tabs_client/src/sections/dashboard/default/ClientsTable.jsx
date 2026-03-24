import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import PropTypes from 'prop-types';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import Pagination from '../../../components/Pagination';
import moment from 'moment';

const headCells = [
  {
    id: 'ID',
    align: 'left',
    disablePadding: false,
    label: 'ID'
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
    align: 'center',
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

export default function ClientsTable({ clients, handlePrev, handleNext, fetchClientDetails, fetchClientAppointments, page, pagination }) {
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
                    <TableRow hover role="checkbox" key={row._id}>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{row._id}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{row?.name}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{moment(row?.dob).format('DD-MM-YYYY')}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{row?.email}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter">
                          {row?.phone}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <Link color="secondary" onClick={() => fetchClientAppointments(row._id)}>
                          <SpeakerNotesIcon color="primary" sx={{ cursor: 'pointer' }} />
                        </Link>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <Link color="secondary" onClick={() => fetchClientDetails(row._id)} sx={{ cursor: 'pointer' }}>
                          <InfoOutlineIcon color="primary" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Pagination pagination={pagination} handlePrev={handlePrev} handleNext={handleNext} page={page} />
          </>
        ) : (
          <Box sx={{ p: 1 }}>No Clients</Box>
        )}
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
