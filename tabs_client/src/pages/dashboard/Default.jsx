import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import AppointmentsTable from '../../sections/dashboard/default/AppointmentsTable';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import AppointmentFilter from '../../components/AppointmentFilter';
import CheckMissingInfo from '../../components/CheckMissingInfo';

export default function DashboardDefault() {
  const { role, isAuthenticated } = useSelector((state) => state.login_slice);
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: 0
  });
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState({
    service: '',
    startDate: '',
    endDate: ''
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingTodayAppointments, setFetchingTodayAppointments] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const fetchAppointmentDetails = async (aid) => {
    navigate(`/dashboard/appointment/details/${aid}`);
  };

  const fetchTodayAppointments = async () => {
    try {
      setFetchingTodayAppointments(true);
      setRefreshing(true);
      const baseUrl = `${import.meta.env.VITE_API_URL}`;
      const endPoint = isFiltered ? `fetch-today-filtered-appointments` : `fetch-today-appointments`;

      const query = isFiltered
        ? `?service=${filters.service}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${page}&limit=${limit}&status=${status}&uid=${tenantId}`
        : `?page=${page}&limit=${limit}&uid=${tenantId}`;

      const { data } = await axios.get(`${baseUrl}${endPoint}${query}`, {
        withCredentials: true
      });

      if (data.success) {
        setAppointments(data.data);
        setPagination(data.pagination);
        setFetchingTodayAppointments(false);
        setRefreshing(false);
      }
    } catch (err) {
      console.log(err.message);
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Multiple validation errors (Zod)
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        // Generic error
        const errorMessage = errorData?.message || 'Something went wrong';
        toast.error(errorMessage);
      }
      setFetchingTodayAppointments(false);
      setRefreshing(false);
    }
  };

  const fetchAppointmentRemarks = (aid) => {
    navigate(`/dashboard/appointment/remarks/${aid}`);
  };

  useEffect(() => {
    if (role === 1 && isAuthenticated && services.length > 0) {
      setIsFiltered(false);
      fetchTodayAppointments();
    }
  }, [page, filters, isModalOpen, isRefreshed]);

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  if (locations.length === 0) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  if (services.length === 0) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  return (
    <>
      {refreshing || fetchingTodayAppointments ? (
        <Loader />
      ) : (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <Grid size={12} container direction="row" alignItems="center" justifyContent="space-between">
              <DashboardHeading
                title={`Today's Appointments (${
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
            </Grid>
            <Grid container direction="column" size={{ xs: 12, md: 12, lg: 12 }}>
              <Grid container size={12} spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AnalyticEcommerce title="Completed" count={pagination.completedAppointments} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AnalyticEcommerce title="Confirmed" count={pagination.confirmedAppointments} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AnalyticEcommerce title="Pending" count={pagination.pendingAppointments} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AnalyticEcommerce title="Cancelled" count={pagination.cancelledAppointments} />
                </Grid>
              </Grid>

              <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
              <Grid size={{ xs: 12, md: 12, lg: 12 }} container direction="column" sx={{ mt: 2 }}>
                <AppointmentFilter setFilters={setFilters} setIsFiltered={setIsFiltered} setPage={setPage} setStatus={setStatus} />
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
              <Grid container direction="row" sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                  <UniqueVisitorCard />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
