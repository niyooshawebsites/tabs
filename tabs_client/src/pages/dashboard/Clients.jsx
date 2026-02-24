import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ClientsTable from '../../sections/dashboard/default/ClientsTable';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';
import { toast } from 'react-toastify';

export default function DashboardClients() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
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

  const navigate = useNavigate();
  const { isDoctor } = useSelector((state) => state.admin_slice);
  const [fetchingClients, setFetchingClients] = useState(false);

  const fetchAllClients = async () => {
    try {
      setFetchingClients(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-clients?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });

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

  const fetchClientDetails = async (cid) => {
    navigate(`/dashboard/client/details/${cid}`);
  };

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const fetchClientAppointments = (cid) => {
    navigate(`/dashboard/client/appointments/${cid}`);
  };

  useEffect(() => {
    if (locations.length > 0) {
      fetchAllClients();
    }
  }, [page]);

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
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {fetchingClients ? (
        <Loader />
      ) : (
        <>
          {clients.length > 0 ? (
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <DashboardHeading
                  title={
                    isDoctor
                      ? `All Patients (${pagination.totalClients < 10 ? `0${pagination.totalClients}` : pagination.totalClients})`
                      : `All Clients (${pagination.totalClients < 10 ? `0${pagination.totalClients}` : pagination.totalClients})`
                  }
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
              <MainCard sx={{ mt: 2 }} content={false}>
                <ClientsTable
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
