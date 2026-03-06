import { FormControl, Select, MenuItem, Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import axios from 'axios';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState();
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      let apiURL = `${import.meta.env.VITE_API_URL}forgot-password`;

      const { data } = await axios.patch(apiURL, values, { withCredentials: true });

      if (data.success) {
        toast.success(data.message);
        resetForm();
      }
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData?.message || 'Something went wrong');
      }
      console.log(err);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        accountType: '',
        email: ''
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="accountType"
                  value={values.accountType}
                  label="Account Type"
                  onChange={handleChange}
                  error={touched.accountType && Boolean(errors.accountType)}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="tenant">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
                {touched.accountType && errors.accountType && (
                  <Typography color="error" variant="caption">
                    {errors.accountType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid sixe={12} sx={{ width: '100%' }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="username-login">Registered Email</InputLabel>
                <OutlinedInput
                  id="username-login"
                  type="text"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>

              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </Grid>

            <Grid size={12}>
              <AnimateButton>
                <Button type="submit" fullWidth size="large" variant="contained" color="primary">
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

ForgotPasswordForm.propTypes = { isDemo: PropTypes.bool };
