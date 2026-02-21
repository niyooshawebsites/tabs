import { Grid, Stack, Button, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import DashboardHeading from '../../components/DashboardHeading';
import { toast } from 'react-toastify';
import { useState } from 'react';
import CheckMissingInfo from '../../components/CheckMissingInfo';

export default function AddAnnouncement() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [announcing, setAnnouncing] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setAnnouncing(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}create-announcement?uid=${tenantId}`, values, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message);
        resetForm();
        setAnnouncing(false);
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
      setAnnouncing(false);
    }
  };

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
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="start">
          <DashboardHeading title="Publish Announcement" />
        </Grid>
        <MainCard sx={{ mt: 2, p: 5 }} content={false}>
          <Formik
            initialValues={{
              message: ''
            }}
            validationSchema={Yup.object().shape({
              message: Yup.string().min(20, 'Message must be atleast 20 characters long').max(255).required('Message is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack sx={{ gap: 1 }}>
                      <InputLabel htmlFor="email-login">Message</InputLabel>
                      <OutlinedInput
                        type="text"
                        name="message"
                        value={values.message}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                        fullWidth
                        error={Boolean(touched.message && errors.message)}
                      />
                    </Stack>
                    {touched.message && errors.message && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid size={12}>
                    <AnimateButton>
                      <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={announcing}>
                        {announcing ? 'Announcing' : 'Announce'}
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
