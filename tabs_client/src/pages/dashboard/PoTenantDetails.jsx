import { Grid, Stack, Typography, Box, Button } from '@mui/material';
import DashboardHeading from '../../components/DashboardHeading';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PoDashboardTenantDetails() {
  const [tenant, setTenant] = useState({
    id: '',
    legalName: '',
    gstNo: '',
    name: '',
    isDoctor: '',
    experience: '',
    proffessinalCourse: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    workingDays: '',
    timings: ''
  });
  const navigate = useNavigate();
  const { tid } = useParams();

  const fetchPoTenantDetail = async (tid) => {
    try {
      let response;

      try {
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-tenant-detail-for-po?tid=${tid}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-tenant-detail-for-po?tid=${tid}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        setTenant({
          id: data.data?._id,
          legalName: data.data?.legalName,
          gstNo: data.data?.gstNo,
          name: data.data?.name,
          isDoctor: data.data?.isDoctor,
          experience: data.data?.experience,
          proffessinalCourse: data.data?.proffessinalCourse,
          phone: data.data?.phone,
          altPhone: data.data?.altPhone,
          email: data.data?.email,
          address: data.data?.address,
          tenantId: data.data?.tenant,
          workingDays: data.data?.workingDays,
          timings: data.data?.timings
        });
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
        console.log(errorMessage);
        toast.error('Error fetching tenant details');
      }
    }
  };

  useEffect(() => {
    fetchPoTenantDetail(tid);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Stack sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DashboardHeading title="Tenant Details" />
            <Button
              sx={{ p: 1 }}
              onClick={() => {
                navigate('/dashboard/all-tenants');
              }}
            >
              Back
            </Button>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Legal Business name
            </Typography>
            <Typography variant="h6">{tenant.legalName || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              GST No
            </Typography>
            <Typography variant="h6">{tenant.gstNo || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Name
            </Typography>
            <Typography variant="h6">{tenant.name || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Are you Doctor?
            </Typography>
            <Typography variant="h6">{tenant.isDoctor || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Experience
            </Typography>
            <Typography variant="h6">{`${tenant.experience} Years` || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Professional Course
            </Typography>
            <Typography variant="h6">{tenant.proffessinalCourse || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Phone
            </Typography>
            <Typography variant="h6">{tenant.phone || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Alternate phone
            </Typography>
            <Typography variant="h6">{tenant.altPhone || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Email
            </Typography>
            <Typography variant="h6">{tenant.email || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Address
            </Typography>
            <Typography variant="h6">{tenant.address || 'N/A'}</Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Working Days
            </Typography>
            <Typography variant="h6">
              {' '}
              {Array.isArray(tenant.workingDays) && tenant.workingDays.length > 0 ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {tenant.workingDays.map((day, index) => {
                    const validDay = typeof day === 'string' ? day : String(day);

                    return (
                      <Typography key={index} variant="h6">
                        {validDay.charAt(0).toUpperCase() + validDay.slice(1)}
                        {index !== tenant.workingDays.length - 1 && ', '}
                      </Typography>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="h6">N/A</Typography>
              )}
            </Typography>
          </Box>

          <Box className="details">
            <Typography variant="h6" className="details-heading">
              Timings
            </Typography>
            <Typography variant="h6">
              {' '}
              {!tenant.timings || typeof tenant.timings !== 'object' ? (
                <Typography variant="h6">N/A</Typography>
              ) : (
                <Stack spacing={1}>
                  {/* Shift Type */}
                  <Typography variant="h6">
                    <span className="details-heading">Shift Type:</span> {tenant.timings.shiftType === 'full' ? 'Full Day' : 'Part Day'}
                  </Typography>

                  {/* Full Day */}
                  {tenant.timings.shiftType === 'full' && (
                    <Typography variant="h6">
                      {tenant.timings.fullDay?.start && tenant.timings.fullDay?.end
                        ? `${tenant.timings.fullDay.start} - ${tenant.timings.fullDay.end}`
                        : 'N/A'}
                    </Typography>
                  )}

                  {/* Part Day */}
                  {tenant.timings.shiftType === 'part' && (
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        Morning:{' '}
                        {tenant.timings.partDay?.morningStart && tenant.timings.partDay?.morningEnd
                          ? `${tenant.timings.partDay.morningStart} - ${tenant.timings.partDay.morningEnd}`
                          : 'N/A'}
                      </Typography>

                      <Typography variant="h6">
                        Evening:{' '}
                        {tenant.timings.partDay?.eveningStart && tenant.timings.partDay?.eveningEnd
                          ? `${tenant.timings.partDay.eveningStart} - ${tenant.timings.partDay.eveningEnd}`
                          : 'N/A'}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
