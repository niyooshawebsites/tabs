import { Box, Grid, Stack, Typography, Card, CardContent } from '@mui/material';
import NonAuthWrapper from 'sections/auth/NonAuthWrapper';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';

export default function SearchAppointment() {
  const { subDomain } = useSelector((state) => state.subDomain_slice);
  const { aid } = useParams();
  const [loading, setLoading] = useState(false);

  const [appointment, setAppointment] = useState({
    id: null,
    service: null,
    date: null,
    time: null,
    status: null
  });

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}search-appointment/${aid}?username=${subDomain}`, {
        withCredentials: true
      });

      if (data.success) {
        setAppointment((prev) => {
          return {
            ...prev,
            id: data.data?._id,
            service: data.data?.service?.name,
            date: moment(data.data?.date).format('DD-MM-YYYY'),
            time: data.data?.time,
            status: data.data?.status
          };
        });
        setLoading(false);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [aid]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <NonAuthWrapper>
          {appointment.id !== null ? (
            <Grid size={12}>
              <Card
                sx={{
                  minWidth: 500,
                  maxWidth: 600,
                  margin: 'auto',
                  mt: 4,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h3" sx={{ textAlign: 'center', mb: 3 }}>
                    Appointment Details.
                  </Typography>

                  {/* Details Section */}
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 500, color: 'gray' }}>Appointment ID:</Typography>
                      <Typography sx={{ color: 'text.primary' }}>{appointment.id || 'Not Available'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 500, color: 'gray' }}>Service:</Typography>
                      <Typography sx={{ color: 'text.primary' }}>{appointment.service || 'Not Available'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 500, color: 'gray' }}>Date:</Typography>
                      <Typography sx={{ color: 'text.primary' }}>{appointment.date || 'Not Available'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 500, color: 'gray' }}>Time:</Typography>
                      <Typography sx={{ color: 'text.primary' }}>{appointment.time || 'Not Available'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 500, color: 'gray' }}>Status:</Typography>
                      <Typography sx={{ color: 'text.primary' }}>{appointment.status || 'Not Available'}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid size={12}>
              <Card
                sx={{
                  maxWidth: 600,
                  margin: 'auto',
                  mt: 4,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>No Appointment Found</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </NonAuthWrapper>
      )}
    </>
  );
}
