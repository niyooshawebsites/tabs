import { Grid, Stack, Button, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import DashboardHeading from '../../components/DashboardHeading';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import { locationSliceActions } from '../../store/slices/LocationSlice';
import NoInfo from '../../components/NoInfo';
import Loader from '../../components/Loader';

export default function DashboardEditLocation() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations, page, limit } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [initialLocation, setInitialLocation] = useState({ name: '' });
  const [fetchingLocationToUpdate, setFetchingLocationToUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { lid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAllLocations = async () => {
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

  const fetchLocationToUpdate = async () => {
    setFetchingLocationToUpdate(true);
    try {
      const apiURL = `${import.meta.env.VITE_API_URL}fetch-a-location/${lid}?uid=${tenantId}`;
      const { data } = await axios.get(apiURL, { withCredentials: true });

      if (data.success) {
        setInitialLocation((prev) => {
          return {
            ...prev,
            name: data?.data?.name
          };
        });
        setFetchingLocationToUpdate(false);
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
      setFetchingLocationToUpdate(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setUpdating(true);

      const payload = {
        ...values,
        name: values.name.toLowerCase().trim()
      };

      const updateApiURL = `${import.meta.env.VITE_API_URL}update-location/${lid}?uid=${tenantId}`;
      const { data } = await axios.patch(updateApiURL, payload, { withCredentials: true });

      if (data.success) {
        toast.success(data.message);
        await fetchAllLocations();
        setUpdating(false);
        resetForm();
        navigate('/dashboard/locations');
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
    fetchLocationToUpdate();
  }, [lid]);

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
      {fetchingLocationToUpdate ? (
        <Loader />
      ) : (
        <>
          {initialLocation.name ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Grid container alignItems="center" justifyContent="start">
                  <DashboardHeading title="Edit Location" />
                </Grid>
                <MainCard sx={{ mt: 2, p: 5 }} content={false}>
                  <Formik
                    initialValues={initialLocation}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                      name: Yup.string()
                        .min(3, 'Location name must be atleast 3 characters long')
                        .max(50, 'Location name must be atmost 50 characters long')
                        .required('Location name is required')
                    })}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid size={12}>
                            <Stack sx={{ gap: 1 }}>
                              <InputLabel htmlFor="name">Location Name</InputLabel>
                              <OutlinedInput
                                type="text"
                                name="name"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter location name"
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
                            <AnimateButton>
                              <Button fullWidth size="large" variant="contained" color="primary" disabled={updating} type="submit">
                                {updating ? 'Updating Location...' : 'Update Location'}
                              </Button>
                            </AnimateButton>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  </Formik>
                </MainCard>
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
