import { Grid, Stack, Button, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import DashboardHeading from '../../components/DashboardHeading';
import { toast } from 'react-toastify';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import { locationSliceActions } from '../../store/slices/LocationSlice';

export default function DashboardAddLocation() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations, page, limit } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [addingLocation, setAddingLocation] = useState(false);
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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setAddingLocation(true);

      const payload = {
        name: values.name.toLowerCase().trim()
      };

      const addApiURL = `${import.meta.env.VITE_API_URL}add-location/${tenantId}`;
      const { data } = await axios.post(addApiURL, payload, { withCredentials: true });

      if (data.success) {
        toast.success(data.message);
        await fetchAllLocations();
        setAddingLocation(false);
        resetForm();
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
      setAddingLocation(false);
    }
  };

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  if (locations.length >= 0) {
    return (
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Grid container alignItems="center" justifyContent="start">
            <DashboardHeading title="Create Location" />
          </Grid>
          <MainCard sx={{ mt: 2, p: 5 }} content={false}>
            <Formik
              initialValues={{
                name: ''
              }}
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
                        <Button fullWidth size="large" variant="contained" color="primary" disabled={addingLocation} type="submit">
                          {addingLocation ? 'Adding Location...' : 'Add Location'}
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
    );
  }
}
