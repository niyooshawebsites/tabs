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

export default function DashboardClientDetails() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
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
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-client-by-client-info/${clientInfo}?uid=${tenantId}`, {
        withCredentials: true
      });

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
      {fetchingClientDetails ? (
        <Loader />
      ) : (
        <>
          {client.id !== null ? (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Stack sx={{ gap: 3 }}>
                  <DashboardHeading title={isDoctor == 'yes' ? `Patient Details` : `Client Details`} />

                  <MainCard title="ID">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.cid || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Name">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.name || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Gender">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.gender || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="DOB">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{moment(client?.dob).format('DD-MM-YYYY') || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Email">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.email || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Phone">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.phone || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Address">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.address || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="City">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.city || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="State">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.state || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Pincode">
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">{client?.pincode || 'N/A'}</Typography>
                    </Breadcrumbs>
                  </MainCard>

                  <MainCard title="Action">
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
                      Appointments
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
