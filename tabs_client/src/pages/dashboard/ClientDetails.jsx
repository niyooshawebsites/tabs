import { Grid, Stack, Typography, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';
import '../../assets/style.css';

export default function DashboardClientDetails() {
  const { role } = useSelector((state) => state.login_slice);
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { id } = useSelector((state) => state.admin_slice);
  const [client, setClient] = useState({
    cid: null,
    name: null,
    gender: null,
    dob: null,
    email: null,
    phone: null,
    address: null,
    city: null,
    state: null,
    pincode: null
  });

  const { clientInfo } = useParams();
  const navigate = useNavigate();
  const { isDoctor } = useSelector((state) => state.admin_slice);
  const [fetchingClientDetails, setFetchingClientDetails] = useState(false);

  const fetchClientDetails = async () => {
    try {
      setFetchingClientDetails(true);
      let response;

      try {
        // original request
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-client-by-client-info/${clientInfo}?uid=${tenantId}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-client-by-client-info/${clientInfo}?uid=${tenantId}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        setClient((prev) => {
          return {
            ...prev,
            cid: data.data?._id,
            name: data.data?.name,
            gender: data.data?.gender,
            dob: data.data?.dob,
            email: data.data?.email,
            phone: data.data?.phone,
            address: data.data?.address,
            city: data.data?.city,
            state: data.data?.state,
            pincode: data.data?.pincode
          };
        });
        setFetchingClientDetails(false);
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
      setFetchingClientDetails(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientInfo]);

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
      {fetchingClientDetails ? (
        <Loader />
      ) : (
        <>
          {client.id !== null ? (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 12 }}>
                <Stack sx={{ gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DashboardHeading title={isDoctor == 'yes' ? `Patient Details` : `Client Details`} />
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        if (role == 1) {
                          navigate(`/dashboard/client/appointments/${client?.cid}`);
                          return;
                        }

                        if (role == 2) {
                          navigate('/dashboard/clients');
                          return;
                        }
                      }}
                    >
                      {`${role == 2 ? 'Clients' : 'Dashboard'} `}
                    </Button>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Client ID
                    </Typography>
                    <Typography variant="h6">{client?.cid || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Name
                    </Typography>
                    <Typography variant="h6">{client?.name || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Gender
                    </Typography>
                    <Typography variant="h6">{client?.gender || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      DOB
                    </Typography>
                    <Typography variant="h6">{moment(client?.dob).format('DD-MM-YYYY') || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Email
                    </Typography>
                    <Typography variant="h6">{client?.email || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Phone
                    </Typography>
                    <Typography variant="h6">{client?.phone || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      Address
                    </Typography>
                    <Typography variant="h6">{client?.address || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      City
                    </Typography>
                    <Typography variant="h6">{client?.city || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Typography variant="h6" className="details-heading">
                      State
                    </Typography>
                    <Typography variant="h6">{client?.state || 'N/A'}</Typography>
                  </Box>

                  <Box title="ID" className="details">
                    <Typography variant="h6" className="details-heading">
                      Pincode
                    </Typography>
                    <Typography variant="h6">{client?.pincode || 'N/A'}</Typography>
                  </Box>

                  <Box className="details">
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        navigate('/dashboard/clients');
                      }}
                    >
                      Back to Clients
                    </Button>
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        navigate(`/dashboard/client/appointments/${client.cid}`);
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
