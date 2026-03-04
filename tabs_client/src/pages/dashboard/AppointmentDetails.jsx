import { Breadcrumbs, Grid, Stack, Typography, Button, Box } from '@mui/material';
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
import '../../assets/style.css';

export default function DashboardAppointmentDetails() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { id } = useSelector((state) => state.admin_slice);
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
    pincode: null,
    notes: null
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
            pincode: data.data?.client?.pincode,
            notes: data.data?.notes
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

  if (!id) {
    return <CheckMissingInfo id={id} locations={locations} services={services} />;
  }

  if (locations.length === 0) {
    return <CheckMissingInfo id={id} locations={locations} services={services} />;
  }

  if (services.length === 0) {
    return <CheckMissingInfo id={id} locations={locations} services={services} />;
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
                <Stack sx={{ gap: 2 }}>
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

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Appointment ID
                    </Typography>
                    <Typography variant="h6">{appointment?.id || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Client ID
                    </Typography>
                    <Typography variant="h6">{appointment?.cid || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Name
                    </Typography>
                    <Typography variant="h6">{appointment?.clientName || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Gender
                    </Typography>
                    <Typography variant="h6">{appointment?.gender || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      DOB
                    </Typography>
                    <Typography variant="h6">{moment(appointment.dob).format('DD-MM-YYYY') || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Service
                    </Typography>
                    <Typography variant="h6">{appointment?.service || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Date
                    </Typography>
                    <Typography variant="h6">{moment(appointment?.date).format('DD-MM-YYYY') || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Time
                    </Typography>
                    <Typography variant="h6">{appointment?.time || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Email
                    </Typography>
                    <Typography variant="h6">{appointment?.email || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Phone
                    </Typography>
                    <Typography variant="h6">{appointment?.phone || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Address
                    </Typography>
                    <Typography variant="h6">{appointment?.address || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      City
                    </Typography>
                    <Typography variant="h6">{appointment?.city || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      State
                    </Typography>
                    <Typography variant="h6">{appointment?.state || 'No Data'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Pincode
                    </Typography>
                    <Typography variant="h6">{appointment?.pincode || 'No Data'}</Typography>
                  </Box>

                  <MainCard title="Notes">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{appointment?.notes || 'No Data'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Action
                    </Typography>
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        navigate('/dashboard/appointments');
                      }}
                    >
                      Back to Appointments
                    </Button>
                  </Box>
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
