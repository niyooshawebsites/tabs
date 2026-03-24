import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import PoTenantClientsTable from '../../sections/dashboard/default/PoTenantClientsTable';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import NoInfo from '../../components/NoInfo';
import { toast } from 'react-toastify';

export default function DashboardClients() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalClients: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const { tid } = useParams();

  const navigate = useNavigate();
  const [fetchingClients, setFetchingClients] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  const fetchTenantClients = async () => {
    try {
      setFetchingClients(true);
      let response;

      try {
        // original request
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-tenant-clients-for-po?page=${page}&limit=${limit}&tid=${tid}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-tenant-clients-for-po?page=${page}&limit=${limit}&tid=${tid}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        setClients(data.data);
        setPagination(data.pagination);
        setFetchingClients(false);
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
      setFetchingClients(false);
    }
  };

  const fetchClientDetails = async (tid, cid) => {
    navigate(`/dashboard/client-details-for-po/${tid}/${cid}`);
  };

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const fetchClientAppointments = (cid) => {
    navigate(`/dashboard/client/appointments-for-po/${cid}`);
  };

  useEffect(() => {
    fetchTenantClients();
  }, [page, isRefreshed]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {fetchingClients ? (
        <Loader />
      ) : (
        <>
          {clients.length > 0 ? (
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <DashboardHeading
                  title={`All Clients (${pagination.totalClients < 10 ? `0${pagination.totalClients}` : pagination.totalClients})`}
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
                <PoTenantClientsTable
                  tid={tid}
                  clients={clients}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  selectedClientId={selectedClientId}
                  fetchClientDetails={fetchClientDetails}
                  setSelectedClientId={setSelectedClientId}
                  fetchClientAppointments={fetchClientAppointments}
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
