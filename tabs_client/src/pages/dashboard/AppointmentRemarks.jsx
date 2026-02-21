import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const { aid } = useParams();
  const [remarks, setRemarks] = useState([]);
  const [fetchingAppointmentRemarks, setFetchingAppointmentRemarks] = useState(false);

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
      {fetchingAppointmentRemarks ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack sx={{ gap: 3 }}>
              <DashboardHeading title="Appointment Remarks" />
              {remarks.length > 0 ? (
                <>
                  <MainCard>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h6">Appointment ID: {aid}</Typography>
                    </Breadcrumbs>
                  </MainCard>
                  {remarks.map((remark) => (
                    <MainCard title={moment(remark.createdAt).format('MMM DD, YYYY [at] hh:mm A')} key={remark._id}>
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
