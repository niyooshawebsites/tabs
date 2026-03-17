import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import TenantsTable from '../../sections/dashboard/default/TenantsTable';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import NoInfo from '../../components/NoInfo';
import { toast } from 'react-toastify';

export default function PoDashboardTenants() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalTenants: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const navigate = useNavigate();
  const [fetchingTenants, setFetchingTenants] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  const fetchAllTenants = async () => {
    try {
      setFetchingTenants(true);
      let response;

      try {
        // original request
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-tenants-for-po?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-tenants-for-po?page=${page}&limit=${limit}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        setTenants(data.data);
        setPagination(data.pagination);
        setFetchingTenants(false);
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
      setFetchingTenants(false);
    }
  };

  const fetchTenantDetails = async (tid) => {
    navigate(`/dashboard/tenant/details/${tid}`);
  };

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const fetchTenantAppointments = (tid) => {
    navigate(`/dashboard/tenant/appointments/${tid}`);
  };

  useEffect(() => {
    fetchAllTenants();
  }, [page, isRefreshed]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {fetchingTenants ? (
        <Loader />
      ) : (
        <>
          {tenants.length > 0 ? (
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <DashboardHeading
                  title={`Tenants (${pagination.totalTenants < 10 ? `0${pagination.totalTenants}` : pagination.totalTenants})`}
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
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <TenantsTable
                  tenants={tenants}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  selectedTenantId={selectedTenantId}
                  fetchTenantDetails={fetchTenantDetails}
                  setSelectedTenantId={setSelectedTenantId}
                  fetchTenantAppointments={fetchTenantAppointments}
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
