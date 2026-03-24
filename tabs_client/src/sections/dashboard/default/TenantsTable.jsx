import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import PropTypes from 'prop-types';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import Pagination from '../../../components/Pagination';
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
    align: 'center',
    disablePadding: false,
    label: 'Appts'
  },
  {
    id: 'totalClients',
    align: 'center',
    disablePadding: false,
    label: 'Clients'
  },
  {
    id: 'totalStaffs',
    align: 'center',
    disablePadding: false,
    label: 'Staffs'
  },
  {
    id: 'totalLocations',
    align: 'center',
    disablePadding: false,
    label: 'Locations'
  },
  {
    id: 'planName',
    align: 'center',
    disablePadding: false,
    label: 'Plan name'
  },
  {
    id: 'PlanPrice',
    align: 'center',
    disablePadding: false,
    label: 'Plan price'
  },
  {
    id: 'doj',
    align: 'center',
    disablePadding: false,
    label: 'DOJ'
  },
  {
    id: 'moreInfo',
    align: 'center',
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

export default function TenantsTable({
  tenants,
  handlePrev,
  handleNext,
  fetchTenantDetails,
  fetchTenantAppointments,
  fetchTenantClients,
  fetchTenantStaffs,
  fetchTenantLocations,
  page,
  pagination
}) {
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
                    <TableRow hover role="checkbox" key={row._id}>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{row._id}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{row?.username}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary">{row?.profession}</span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter" onClick={() => fetchTenantAppointments(row._id)}>
                          {row?.appointmentCount}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter" onClick={() => fetchTenantClients(row._id)}>
                          {row?.clientCount}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter" onClick={() => fetchTenantStaffs(row._id)}>
                          {row?.staffCount}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row" onClick={() => fetchTenantLocations(row._id)}>
                        <span color="secondary" className="tableContentCenter">
                          {row?.locationCount}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter">
                          {row?.plan?.name.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter">
                          {row?.plan?.price}
                        </span>
                      </TableCell>
                      <TableCell component="td" id={labelId} scope="row">
                        <span color="secondary" className="tableContentCenter">
                          {row?.plan?.price}
                        </span>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Link color="secondary" onClick={() => fetchTenantDetails(row._id)} className="tableContentCenter">
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
          <Box sx={{ p: 1 }}>No Tenants</Box>
        )}
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
