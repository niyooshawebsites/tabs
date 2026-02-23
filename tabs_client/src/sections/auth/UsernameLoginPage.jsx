import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';

export default function UsernameLoginPage({ isDemo = false }) {
  const handleSubmit = async (values) => {
    try {
      // Example redirect
      const redirectUrl = `https://${values.username}.${import.meta.env.VITE_API_URL}/login`;
      window.location.replace(redirectUrl);
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData?.message || 'Something went wrong');
      }

      console.error(err);
    }
  };

  return (
    <Formik
      initialValues={{
        username: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Registered username is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="username-login">Registered Username</InputLabel>
                <OutlinedInput
                  id="username-login"
                  type="text"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter your registered username"
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                />
              </Stack>

              {touched.username && errors.username && <FormHelperText error>{errors.username}</FormHelperText>}
            </Grid>

            <Grid item xs={12}>
              <AnimateButton>
                <Button type="submit" fullWidth size="large" variant="contained" color="primary" disabled={loading}>
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

UsernameLoginPage.propTypes = { isDemo: PropTypes.bool };
