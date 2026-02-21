import { Grid, Stack, Button, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import DashboardHeading from '../../components/DashboardHeading';
import { toast } from 'react-toastify';

export default function DashboardUpdatePassword() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Password Mismatch!');
      return;
    }
    try {
      setUpdatingPassword(true);
      const addApiURL = `${import.meta.env.VITE_API_URL}update-tenant/${tenantId}`;
      const { data } = await axios.patch(
        addApiURL,
        {
          password: values.password
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setUpdatingPassword(false);
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
      setUpdatingPassword(false);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="start">
          <DashboardHeading title="Add Service" />
        </Grid>
        <MainCard sx={{ mt: 2, p: 5 }} content={false}>
          <Formik
            initialValues={{
              password: '',
              confirmPassword: ''
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().min(6, 'Password must be atleast 6 characters long').max(255).required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm Password is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack sx={{ gap: 1 }}>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        type="password"
                        name="password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="**********"
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error id="standard-weight-helper-text-password">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid size={12}>
                    <Stack sx={{ gap: 1 }}>
                      <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        type="password"
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="**********"
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      />
                    </Stack>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText error id="standard-weight-helper-text-confirmPassword">
                        {errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid size={12}>
                    <AnimateButton>
                      <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={updatingPassword}>
                        {updatingPassword ? 'Updating Password...' : 'Update Password'}
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
