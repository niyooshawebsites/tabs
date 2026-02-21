import {
  Grid,
  Stack,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
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
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';

export default function DashboardEditStaff() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [initialStaff, setInitialStaff] = useState({
    name: '',
    empId: '',
    sid: [],
    email: '',
    password: '',
    handlesAllServices: false,
    lid: ''
  });
  const [fetchingStaffToUpdate, setFetchingStaffToUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const fetchStaffToUpdate = async () => {
    setFetchingStaffToUpdate(true);
    try {
      const apiURL = `${import.meta.env.VITE_API_URL}fetch-a-staff/${staffId}?uid=${tenantId}`;
      const { data } = await axios.get(apiURL, { withCredentials: true });

      if (data.success) {
        setInitialStaff((prev) => {
          return {
            ...prev,
            name: data?.data?.name,
            empId: data?.data?.empId,
            sid: data?.data?.services?.map((s) => s._id) || [], // <-- fixed
            email: data?.data?.email,
            password: data?.data?.password,
            handlesAllServices: data?.data?.handlesAllServices || false,
            lid: data?.data?.location?._id
          };
        });
        setFetchingStaffToUpdate(false);
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
      setFetchingStaffToUpdate(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setUpdating(true);

      const payload = {
        ...values,
        name: values.name.toLowerCase().trim(),
        email: values.email.toLowerCase().trim(),
        empId: values.empId.toLowerCase().trim()
      };

      const updateApiURL = `${import.meta.env.VITE_API_URL}update-staff-details/${staffId}?uid=${tenantId}`;

      const { data } = await axios.patch(updateApiURL, payload, { withCredentials: true });

      if (data.success) {
        toast.success(data.message);
        setUpdating(false);
        resetForm();
        navigate('/dashboard/staff');
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
    fetchStaffToUpdate();
  }, [staffId]);

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
      {fetchingStaffToUpdate ? (
        <Loader />
      ) : (
        <>
          {initialStaff.name ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Grid container alignItems="center" justifyContent="start">
                  <DashboardHeading title="Edit Staff" />
                </Grid>
                <MainCard sx={{ mt: 2, p: 5 }} content={false}>
                  <Formik
                    initialValues={initialStaff}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                      name: Yup.string()
                        .min(3, 'Employee name must be atleast 3 characters long')
                        .max(255)
                        .required('Employee name is required'),
                      empId: Yup.string().required('Employee ID is required'),
                      sid: Yup.array().when('handlesAllServices', (handlesAllServices, schema) => {
                        if (handlesAllServices === false) {
                          return schema.min(1, 'Select at least one service');
                        }
                        return schema;
                      }),
                      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                      password: Yup.string().required('Password is required'),
                      handlesAllServices: Yup.boolean().required('Service handling is required'),
                      lid: Yup.string().required('Location is required')
                    })}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid size={12}>
                            <Stack sx={{ gap: 1 }}>
                              <InputLabel htmlFor="name">Employee Name</InputLabel>
                              <OutlinedInput
                                type="text"
                                name="name"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter employee name"
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
                              <InputLabel htmlFor="empId">Employee ID</InputLabel>
                              <OutlinedInput
                                fullWidth
                                type="text"
                                value={values.empId}
                                name="empId"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter employee ID"
                                error={Boolean(touched.empId && errors.empId)}
                              />
                            </Stack>
                            {touched.empId && errors.empId && (
                              <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.empId}
                              </FormHelperText>
                            )}
                          </Grid>

                          <Grid size={12}>
                            <FormControl fullWidth>
                              <InputLabel>All or Selcted Serivces</InputLabel>
                              <Select
                                name="handlesAllServices"
                                value={values.handlesAllServices}
                                label="All or Selected Services"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const boolVal = val === 'true' ? true : val === 'false' ? false : '';
                                  handleChange({ target: { name: 'handlesAllServices', value: boolVal } });

                                  if (boolVal === true) {
                                    handleChange({ target: { name: 'sid', value: [] } });
                                  }
                                }}
                                error={touched.handlesAllServices && Boolean(errors.handlesAllServices)}
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="true">All Services</MenuItem>
                                <MenuItem value="false">Selected Services</MenuItem>
                              </Select>
                              {touched.handlesAllServices && errors.handlesAllServices && (
                                <Typography color="error" variant="caption">
                                  {errors.handlesAllServices}
                                </Typography>
                              )}
                            </FormControl>
                          </Grid>

                          {values.handlesAllServices === false && (
                            <Grid size={12}>
                              <FormControl component="fieldset" fullWidth>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                  Select Services
                                </Typography>

                                <Stack sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
                                  {services.map((service) => (
                                    <label key={service._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                      <input
                                        type="checkbox"
                                        name="sid"
                                        value={service._id}
                                        checked={(values.sid || []).includes(service._id)}
                                        onChange={(e) => {
                                          const { checked, value } = e.target;
                                          if (checked) {
                                            handleChange({
                                              target: { name: 'sid', value: [...values.sid, value] }
                                            });
                                          } else {
                                            handleChange({
                                              target: { name: 'sid', value: values.sid.filter((v) => v !== value) }
                                            });
                                          }
                                        }}
                                        style={{ marginRight: 8 }}
                                      />
                                      {service.name}
                                    </label>
                                  ))}
                                </Stack>

                                {touched.sid && errors.sid && (
                                  <Typography color="error" variant="caption">
                                    {errors.sid}
                                  </Typography>
                                )}
                              </FormControl>
                            </Grid>
                          )}

                          <Grid size={12}>
                            <FormControl fullWidth>
                              <InputLabel>Location</InputLabel>
                              <Select
                                name="lid"
                                value={values.lid}
                                label="Location"
                                onChange={handleChange}
                                error={touched.lid && Boolean(errors.lid)}
                              >
                                <MenuItem value="">Select Location</MenuItem>
                                {locations.map((location) => (
                                  <MenuItem key={location._id} value={location._id}>
                                    {location.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.lid && errors.lid && (
                                <Typography color="error" variant="caption">
                                  {errors.lid}
                                </Typography>
                              )}
                            </FormControl>
                          </Grid>

                          <Grid size={12}>
                            <Stack sx={{ gap: 1 }}>
                              <InputLabel htmlFor="email-login">Email Address</InputLabel>
                              <OutlinedInput
                                id="email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                fullWidth
                                error={Boolean(touched.email && errors.email)}
                              />
                            </Stack>
                            {touched.email && errors.email && (
                              <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.email}
                              </FormHelperText>
                            )}
                          </Grid>

                          <Grid size={12}>
                            <Stack sx={{ gap: 1 }}>
                              <InputLabel htmlFor="password-login">Password</InputLabel>
                              <OutlinedInput
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                id="-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
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
                                placeholder="Enter password"
                              />
                            </Stack>
                            {touched.password && errors.password && (
                              <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password}
                              </FormHelperText>
                            )}
                          </Grid>
                          <Grid size={12}>
                            <AnimateButton>
                              <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={updating}>
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
            </Grid>
          ) : (
            <NoInfo />
          )}
        </>
      )}
    </>
  );
}
