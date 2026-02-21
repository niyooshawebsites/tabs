import { Grid, Stack, Button, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import DashboardHeading from '../../components/DashboardHeading';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import Loader from '../../components/Loader';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';

export default function EditService() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services, page, limit } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [initialService, setInitialService] = useState({ name: '', charges: '', duration: '' });
  const [fetchingServiceToUpdate, setFetchingServiceToUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { sid } = useParams();

  const fetchAllServices = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });

      if (data.success) {
        dispatch(
          locationSliceActions.captureLocationDetails({
            locations: data?.data,
            totalLocations: data?.pagination?.totalLocations,
            totalPages: data?.pagination?.totalPages,
            hasNextPage: data?.pagination?.hasNextPage,
            hasPrevPage: data?.pagination?.hasPrevPage,
            limit: data?.pagination?.limit,
            page: data?.pagination?.page
          })
        );
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
    }
  };

  const fetchServiceToUpdate = async () => {
    setFetchingServiceToUpdate(true);
    try {
      const apiURL = `${import.meta.env.VITE_API_URL}fetch-service/${sid}?uid=${tenantId}`;
      const { data } = await axios.get(apiURL, { withCredentials: true });

      if (data.success) {
        setInitialService((prev) => {
          return {
            ...prev,
            name: data.data.name,
            charges: data.data.charges,
            duration: data.data.duration
          };
        });
        setFetchingServiceToUpdate(false);
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
      setFetchingServiceToUpdate(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setUpdating(true);

      const updateApiURL = `${import.meta.env.VITE_API_URL}update-service/${sid}?uid=${tenantId}`;

      const { data } = await axios.patch(updateApiURL, values, { withCredentials: true });

      if (data.success) {
        toast.success(data.message);
        setUpdating(false);
        await fetchAllServices();
        resetForm();
        navigate('/dashboard/services');
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
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchServiceToUpdate();
  }, [sid]);

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
      {fetchingServiceToUpdate ? (
        <Loader />
      ) : (
        <>
          {initialService.name ? (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Grid container alignItems="center" justifyContent="start">
                <DashboardHeading title="Edit Service" />
              </Grid>
              <MainCard sx={{ mt: 2, p: 5 }} content={false}>
                <Formik
                  initialValues={initialService}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .min(3, 'Service name must be atleast 3 characters long')
                      .max(255)
                      .required('Service name is required'),
                    charges: Yup.number().required('Charges is required').min(1, 'Charges must not be 0')
                  })}
                  onSubmit={handleSubmit}
                >
                  {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid size={12}>
                          <Stack sx={{ gap: 1 }}>
                            <InputLabel htmlFor="email-login">Service</InputLabel>
                            <OutlinedInput
                              type="text"
                              name="name"
                              value={values.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Enter service name"
                              fullWidth
                              error={Boolean(touched.name && errors.name)}
                            />
                          </Stack>
                          {touched.name && errors.name && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                              {errors.name}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid size={12}>
                          <Stack sx={{ gap: 1 }}>
                            <InputLabel htmlFor="password-login">Charges</InputLabel>
                            <OutlinedInput
                              fullWidth
                              type="number"
                              value={values.charges}
                              name="charges"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Enter service charges"
                              error={Boolean(touched.charges && errors.charges)}
                            />
                          </Stack>
                          {touched.charges && errors.charges && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                              {errors.charges}
                            </FormHelperText>
                          )}
                        </Grid>

                        <Grid size={12}>
                          <Stack sx={{ gap: 1 }}>
                            <InputLabel htmlFor="duration">Average service duration in minutes</InputLabel>
                            <OutlinedInput
                              fullWidth
                              type="number"
                              value={values.duration}
                              name="duration"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Enter service charges"
                              error={Boolean(touched.duration && errors.duration)}
                            />
                          </Stack>
                          {touched.duration && errors.duration && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                              {errors.duration}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid size={12}>
                          <AnimateButton>
                            <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={loading}>
                              {updating ? 'Updating Service...' : 'Update Service'}
                            </Button>
                          </AnimateButton>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
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
