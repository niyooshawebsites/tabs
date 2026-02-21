import { Breadcrumbs, Grid, Stack, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MainCard from 'components/MainCard';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';

export default function DashboardAppointmentDetails() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [appointment, setAppointment] = useState({
    id: null,
    cid: null,
    clientName: null,
    gender: null,
    dob: null,
    service: null,
    date: null,
    time: null,
    email: null,
    phone: null,
    address: null,
    city: null,
    state: null,
    pincode: null
  });

  const [fetchingAppointmentDetails, setFetchingAppointmentDetails] = useState(false);
  const { aid } = useParams();
  const navigate = useNavigate();

  const fetchAppointment = async () => {
    try {
      setFetchingAppointmentDetails(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}dashboard-search-appointment/${aid}?uid=${tenantId}`, {
        withCredentials: true
      });

      if (data.success) {
        setAppointment((prev) => {
          return {
            ...prev,
            id: data.data?._id,
            cid: data.data?.client?._id,
            clientName: data.data?.client?.name,
            gender: data.data?.client?.gender,
            dob: data.data?.client?.dob,
            service: data.data?.service?.name,
            date: data.data?.date,
            time: data.data?.time,
            email: data.data?.client?.email,
            phone: data.data?.client?.phone,
            address: data.data?.client?.address,
            city: data.data?.client?.city,
            state: data.data?.client?.state,
            pincode: data.data?.client?.pincode
          };
        });
        setFetchingAppointmentDetails(false);
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
      setFetchingAppointmentDetails(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [aid]);

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
      {fetchingAppointmentDetails ? (
        <Loader />
      ) : (
        <>
          {appointment !== null ? (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Stack sx={{ gap: 3 }}>
                  <DashboardHeading title="Appointment Details" />

                  <MainCard title="Appointment ID">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.id || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Client ID">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.cid || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Name">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.clientName || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Gender">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.gender || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="DOB">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{moment(appointment.dob).format('DD-MM-YYYY') || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Service">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.service || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Date">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{moment(appointment?.date).format('DD-MM-YYYY') || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Time">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.time || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Email">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.email || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Phone">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.phone || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Address">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.address || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="City">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.city || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="State">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.state || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Pincode">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.pincode || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Action">
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        navigate('/dashboard/appointments');
                      }}
                    >
                      Back to Appointments
                    </Button>
                  </MainCard>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <NoInfo />
          )}
        </>
      )}
    </>
  );
}
