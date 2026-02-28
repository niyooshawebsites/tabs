import { Breadcrumbs, Grid, Stack, Typography, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MainCard from '../../components/MainCard';
import NoInfo from '../../components/NoInfo';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import CheckMissingInfo from '../../components/CheckMissingInfo';

export default function DashboardAppointmentRemarks() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { name: empName, empId } = useSelector((state) => state.login_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const { aid } = useParams();
  const [remarks, setRemarks] = useState([]);
  const [fetchingAppointmentRemarks, setFetchingAppointmentRemarks] = useState(false);
  const navigate = useNavigate();

  const fetchAppointmentRemarks = async (aid) => {
    try {
      setFetchingAppointmentRemarks(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}dashboard-search-appointment/${aid}?uid=${tenantId}`, {
        withCredentials: true
      });

      if (data.success) {
        setRemarks(data.data?.remarks.reverse());
        setFetchingAppointmentRemarks(false);
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
      setFetchingAppointmentRemarks(false);
    }
  };

  useEffect(() => {
    fetchAppointmentRemarks(aid);
  }, []);

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
    <>
      {fetchingAppointmentRemarks ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack sx={{ gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DashboardHeading title="Appointment Details" />
                <Button
                  sx={{ p: 1 }}
                  onClick={() => {
                    navigate('/dashboard/appointments');
                  }}
                >
                  Back to Appointments
                </Button>
              </Box>
              {remarks.length > 0 ? (
                <>
                  <MainCard>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">Appointment ID: {aid}</Typography>
                    </Breadcrumbs>
                  </MainCard>
                  {remarks.map((remark) => (
                    <MainCard
                      title={`${moment(remark.createdAt).format('MMM DD, YYYY [at] hh:mm A')} by ${
                        empId ? `${empName} - ${empId}` : 'ADMIN'
                      }`}
                      key={remark._id}
                    >
                      <Breadcrumbs aria-label="breadcrumb">
                        <Typography variant="h6">{remark?.message}</Typography>
                      </Breadcrumbs>
                    </MainCard>
                  ))}
                </>
              ) : (
                <NoInfo />
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
    </>
  );
}
