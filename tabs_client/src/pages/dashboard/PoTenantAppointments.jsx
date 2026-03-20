import { Grid, Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AppointmentsTable from '../../sections/dashboard/default/AppointmentsTable';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import AppointmentFilter from '../../components/AppointmentFilter';
import NoInfo from '../../components/NoInfo';

export default function PoTenantAppointments() {
  const { tid } = useParams();
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
    location: '',
    startDate: '',
    endDate: '',
    status: 'Pending'
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const navigate = useNavigate();

  const fetchTenatAppointments = async () => {
    try {
      setFetchingAppointments(true);
      const baseUrl = `${import.meta.env.VITE_API_URL}`;

      const endPoint = isFiltered ? `fetch-filtered-tenant-appointments-for-po` : `fetch-tenant-appointments-for-po`;

      const query = isFiltered
        ? `?service=${filters.service}&location=${filters.location}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${page}&limit=${limit}&status=${status}&tid=${tid}`
        : `?page=${page}&limit=${limit}&tid=${tid}`;

      let response;

      try {
        // original request
        response = await axios.get(`${baseUrl}${endPoint}${query}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${baseUrl}${endPoint}${query}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

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
    fetchTenatAppointments();
  }, [page, filters, isModalOpen, isRefreshed]);

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
                      toast.success('Data refreshed successfully');
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
