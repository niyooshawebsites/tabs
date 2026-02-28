import { Grid, Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AppointmentsTable from '../../sections/dashboard/default/AppointmentsTable';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import AppointmentFilter from '../../components/AppointmentFilter';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';

export default function DashboardAppointments() {
  const { role, isAuthenticated } = useSelector((state) => state.login_slice);
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({
    totalAppointments: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    service: '',
    startDate: '',
    endDate: '',
    status: 'Pending'
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const navigate = useNavigate();

  const fetchAllppointments = async () => {
    try {
      setFetchingAppointments(true);
      const baseUrl = `${import.meta.env.VITE_API_URL}`;
      let endPoint;
      let query;

      // for platform owner
      // if (role === 2 && isAuthenticated) {
      //   endPoint = isFiltered ? `fetch-filtered-appointments-for-platform-owner` : `fetch-all-appointments-for-platform-owner`;

      //   query = isFiltered
      //     ? `?service=${filters.service}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${page}&limit=${limit}&status=${status}`
      //     : `?page=${page}&limit=${limit}`;
      // }

      // for employee or tenant
      if ((role === 1 || role === 2) && isAuthenticated) {
        endPoint = isFiltered ? `fetch-filtered-appointments` : `fetch-all-appointments`;

        query = isFiltered
          ? `?service=${filters.service}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${page}&limit=${limit}&status=${status}&uid=${tenantId}`
          : `?page=${page}&limit=${limit}&uid=${tenantId}`;
      }

      const { data } = await axios.get(`${baseUrl}${endPoint}${query}`, {
        withCredentials: true
      });

      if (data.success) {
        setAppointments(data.data);
        setPagination(data.pagination);
        setFetchingAppointments(false);
      }
    } catch (err) {
      console.log(err);
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Multiple validation errors (Zod)
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        // Generic error
        const errorMessage = errorData?.message || 'Something went wrong';
        toast.error(errorMessage);
      }
      setFetchingAppointments(false);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const fetchAppointmentDetails = (aid) => {
    navigate(`/dashboard/appointment/details/${aid}`);
  };

  const fetchAppointmentRemarks = (aid) => {
    navigate(`/dashboard/appointment/remarks/${aid}`);
  };

  useEffect(() => {
    if (services.length > 0) {
      fetchAllppointments();
    }
  }, [page, filters, isModalOpen, isRefreshed]);

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  if (locations.length === 0) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  if (services.length === 0) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {fetchingAppointments ? (
        <Loader />
      ) : (
        <>
          {appointments.length > 0 ? (
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    width: '100%',
                    px: 3,
                    mt: 3,
                    gap: 2
                  }}
                >
                  <DashboardHeading
                    title={`All Appointments (${
                      pagination.totalAppointments < 10 ? `0${pagination.totalAppointments}` : pagination.totalAppointments
                    })`}
                  />

                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      textDecoration: 'none',
                      alignSelf: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setIsRefreshed((prev) => !prev);
                    }}
                  >
                    Refresh
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    width: '100%',
                    px: 3,
                    mt: 3,
                    gap: 2
                  }}
                >
                  <AppointmentFilter setFilters={setFilters} setIsFiltered={setIsFiltered} setPage={setPage} setStatus={setStatus} />
                </Box>
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <AppointmentsTable
                  appointments={appointments}
                  setIsModalOpen={setIsModalOpen}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  selectedAppointmentId={selectedAppointmentId}
                  setSelectedAppointmentId={setSelectedAppointmentId}
                  fetchAppointmentDetails={fetchAppointmentDetails}
                  fetchAppointmentRemarks={fetchAppointmentRemarks}
                  isModalOpen={isModalOpen}
                  page={page}
                  pagination={pagination}
                />
              </MainCard>
            </Grid>
          ) : (
            <NoInfo />
          )}
        </>
      )}
    </Grid>
  );
}
