import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Ticker from '../../components/Ticker';
import * as Yup from 'yup';
import { Formik } from 'formik';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthRegister() {
  const [level, setLevel] = useState({ color: '#ccc', label: 'Weak' });
  const [showPassword, setShowPassword] = useState(false);

  const [subDomainName, setSubDomainName] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      const apiURL = `${import.meta.env.VITE_API_URL}register`;
      const { data } = await axios.post(apiURL, values, {
        withCredentials: true
      });
      if (data.success) {
        toast.success(data.message);
        setSubDomainName(values.username);
        resetForm();
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      {subDomainName ? (
        <Ticker
          msg={`Contgrats! Your application is ready. `}
          link={`https://${subDomainName}.byao-client.vercel.app`}
          linkText={'Visit Now'}
        />
      ) : (
        ''
      )}
      <Formik
        initialValues={{
          email: '',
          username: '',
          password: '',
          profession: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .min(3, 'Username must be more than 2 characters')
            .max(30, 'Username must be less than 30 characters')
            .matches(/^[a-z0-9]+$/, 'Username can only contain lowercase letters and numbers, no spaces or special characters')
            .required('Username is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(30, 'Password must be less than 30 characters'),
          profession: Yup.string().required('Profession is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                    id="username"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="balaniclinic"
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  No spaces, no special characters, no captial letters are allowed{' '}
                </Typography>
                {touched.username && errors.username && (
                  <FormHelperText error id="helper-text-username">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@company.com"
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="profession">Profession</InputLabel>
                  <FormControl fullWidth>
                    <select
                      id="profession"
                      name="profession"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.profession}
                      style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid rgba(133, 133, 133, 0.23)',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select Profession</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Beautician">Beautician</option>
                      <option value="Coaching and Consulting">Coaching and Consulting</option>
                      <option value="Education and Tutoring">Education and Tutoring</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Gym">Gym</option>
                      <option value="Health and Wellness">Health and Wellness</option>
                      <option value="Others">Others</option>
                      <option value="Painter and Decorator">Painter and Decorator</option>
                      <option value="Pest Control">Pest Control</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Salons and Spas">Salons and Spas</option>
                      <option value="Tax Legal Financial">Tax Legal Financial</option>
                    </select>
                  </FormControl>
                </Stack>
                {touched.profession && errors.profession && (
                  <FormHelperText error id="helper-text-profession">
                    {errors.profession}
                  </FormHelperText>
                )}
              </Grid>

              <Grid size={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
