import {
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Button
} from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Dot from 'components/@extended/Dot';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import moment from 'moment';
import AppointmentStatusUpdateModal from '../../../components/AppointmentStatusUpdateModal';
import { appointmentStatusSliceActions } from '../../../store/slices/AppointmentStatusSlice';

const headCells = [
  {
    id: 'ID',
    align: 'left',
    disablePadding: false,
    label: 'Appointment ID.'
  },
  {
    id: 'Service',
    align: 'left',
    disablePadding: true,
    label: 'Service'
  },
  {
    id: 'Name',
    align: 'left',
    disablePadding: false,
    label: 'Name'
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
    id: 'Date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
  },
  {
    id: 'Time',
    align: 'left',
    disablePadding: false,
    label: 'Time'
  },
  {
    id: 'Status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'Action',
    align: 'left',
    disablePadding: false,
    label: 'Action'
  },
  {
    id: 'Invoice',
    align: 'left',
    disablePadding: false,
    label: 'Invoice'
  },
  {
    id: 'Remarks',
    align: 'left',
    disablePadding: false,
    label: 'Remarks'
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

function AppointmentStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'Pending':
      color = 'warning';
      title = 'Pending';
      break;
    case 'Completed':
      color = 'success';
      title = 'Completed';
      break;
    case 'Cancelled':
      color = 'error';
      title = 'Cancelled';
      break;
    case 'Confirmed':
      color = 'info';
      title = 'Confirmed';
      break;
    default:
      color = 'primary';
      title = 'Rescheduled';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function AppointmentsTable({
  appointments,
  setIsModalOpen,
  handlePrev,
  handleNext,
  fetchAppointmentDetails,
  fetchAppointmentRemarks,
  isModalOpen,
  page,
  pagination
}) {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  // const { role, isAuthenticated } = useSelector((state) => state.login_slice);
  const dispatch = useDispatch();

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
        {appointments.length > 0 ? (
          <>
            {' '}
            <Table aria-labelledby="tableTitle">
              <OrderTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {appointments.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <>
                      <TableRow
                        hover
                        role="checkbox"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        tabIndex={-1}
                        key={row._id}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{row._id}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{row?.service?.name}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{row?.client?.name}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{row?.client?.email}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{row?.client?.phone}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{moment(row?.date).format('DD-MM-YYYY')}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <span color="secondary">{row?.time}</span>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <AppointmentStatus status={row?.status} />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <Button
                            size="small"
                            color={'primary'}
                            variant={'outlined'}
                            onClick={() => {
                              dispatch(
                                appointmentStatusSliceActions.captureAppointmentIdForStatusUpdate({
                                  aid: row?._id
                                })
                              );

                              setIsModalOpen(true);
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            Update
                          </Button>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row?.status == 'Completed' ? (
                            <a href={`${import.meta.env.VITE_API_URL}generate-invoice/${row?._id}?uid=${tenantId}`} target="_blank">
                              <Typography sx={{ cursor: 'pointer' }}>
                                <FileDownloadIcon />
                              </Typography>
                            </a>
                          ) : (
                            <FileDownloadOffIcon disabled={true} />
                          )}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <Link color="secondary" onClick={() => fetchAppointmentRemarks(row._id)}>
                            <SpeakerNotesIcon color="primary" sx={{ cursor: 'pointer' }} />
                          </Link>
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <Link color="secondary" onClick={() => fetchAppointmentDetails(row._id)}>
                            <InfoOutlineIcon color="primary" sx={{ cursor: 'pointer' }} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    </>
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
            <AppointmentStatusUpdateModal
              isOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Update Appointment Details"
            />
          </>
        ) : (
          <Box sx={{ p: 1 }}>No Appointments</Box>
        )}
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

AppointmentStatus.propTypes = { status: PropTypes.string };
