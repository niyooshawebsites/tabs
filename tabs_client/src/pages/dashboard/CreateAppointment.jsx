import { Grid, Typography, Box, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import ClientSearchModal from '../../components/ClientSearchModal';
import states from '../../constants/states';
import moment from 'moment';
import CheckMissingInfo from '../../components/CheckMissingInfo';

export default function CreateAppointment() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [submittingClientInfo, setSubmittingClientInfo] = useState(false);
  const [bookingAppointment, setBookingAppointment] = useState(false);
  const [isClientSearchModalOpen, setIsClientSearchModalOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    service: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm'),
    name: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      setBookingAppointment(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}book-appointment?uid=${tenantId}`, values, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message);
        resetForm();
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) errorData.errors.forEach((msg) => toast.error(msg));
      else toast.error(errorData?.message || 'Something went wrong');
    } finally {
      setBookingAppointment(false);
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleSubmitClientInfo = async (values, { resetForm }) => {
    try {
      setSubmittingClientInfo(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-client-by-client-info/${values.phone}?uid=${tenantId}`, {
        withCredentials: true
      });

      if (data.success) {
        setAppointmentDetails((prev) => {
          return {
            ...prev,
            service: '',
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm'),
            name: data?.data?.name || '',
            gender: data?.data?.gender || '',
            dob: data?.data?.dob ? moment(data.data?.dob).format('YYYY-MM-DD') : '',
            email: data?.data?.email || '',
            phone: data?.data?.phone || '',
            address: data?.data?.address || '',
            city: data?.data?.city || '',
            state: data?.data?.state || '',
            pincode: data?.data?.pincode || ''
          };
        });
        setIsClientSearchModalOpen(false);
        resetForm();
        setSubmittingClientInfo(false);
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
      setSubmittingClientInfo(false);
    }
  };

  const validationSchema = Yup.object({
    service: Yup.string().required('Service is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    name: Yup.string().required('Full name is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('Date of Birth is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter valid 10-digit phone number')
      .required('Phone is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Enter valid 6-digit pincode')
      .required('Pincode is required')
  });

  if (!legalName || !phone || !altPhone || !address || !name || !email) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  if (locations.length === 0) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  if (services.length === 0) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Grid container spacing={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              px: 3,
              mt: 3
            }}
          >
            <Typography variant="h3">Book Appointment</Typography>

            <Typography
              variant="body1"
              color="primary"
              sx={{
                textDecoration: 'none',
                alignSelf: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setIsClientSearchModalOpen(true)}
            >
              Fetch Details
            </Typography>
          </Box>

          <Grid size={12}>
            <Formik
              key={JSON.stringify(appointmentDetails)}
              enableReinitialize
              initialValues={appointmentDetails}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, touched, errors }) => (
                <Form>
                  {/* Service Details */}
                  <Typography variant="h6" mb={1}>
                    Select Service
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Column 1 - Service */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Service</InputLabel>
                        <Select
                          name="service"
                          value={values.service}
                          label="Service"
                          onChange={handleChange}
                          error={touched.service && Boolean(errors.service)}
                        >
                          <MenuItem value="">Select Service</MenuItem>
                          {services.map((service) => (
                            <MenuItem key={service._id} value={service._id}>
                              {service.name} - ₹{service.charges}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.service && errors.service && (
                          <Typography color="error" variant="caption">
                            {errors.service}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Column 2 - Date */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={touched.date && Boolean(errors.date)}
                        helperText={touched.date && errors.date}
                      />
                    </Grid>

                    {/* Column 3 - Time */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Time"
                        name="time"
                        value={values.time}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={touched.time && Boolean(errors.time)}
                        helperText={touched.time && errors.time}
                      />
                    </Grid>
                  </Grid>

                  {/* Personal Details */}
                  <Box mt={4}>
                    <Typography variant="h6">Personal Details</Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            name="gender"
                            value={values.gender}
                            label="Gender"
                            onChange={handleChange}
                            error={touched.gender && Boolean(errors.gender)}
                          >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                          </Select>
                          {touched.gender && errors.gender && (
                            <Typography color="error" variant="caption">
                              {errors.gender}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Date of Birth"
                          name="dob"
                          value={values.dob}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          error={touched.dob && Boolean(errors.dob)}
                          helperText={touched.dob && errors.dob}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Contact Info */}
                  <Box mt={4}>
                    <Typography variant="h6">Contact Details</Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={values.phone}
                          onChange={handleChange}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Address Details */}
                  <Box mt={4}>
                    <Typography variant="h6">Address Details</Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={values.address}
                          onChange={handleChange}
                          error={touched.address && Boolean(errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={values.city}
                          onChange={handleChange}
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel>State</InputLabel>
                          <Select
                            name="state"
                            value={values.state}
                            label="State"
                            onChange={handleChange}
                            error={touched.state && Boolean(errors.state)}
                          >
                            <MenuItem value="">Select State</MenuItem>
                            {states.map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.state && errors.state && (
                            <Typography color="error" variant="caption">
                              {errors.state}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Pincode"
                          name="pincode"
                          value={values.pincode}
                          onChange={handleChange}
                          error={touched.pincode && Boolean(errors.pincode)}
                          helperText={touched.pincode && errors.pincode}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Submit Button */}
                  <Box mt={5}>
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                      {bookingAppointment ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} /> Booking...
                        </>
                      ) : (
                        'Book Appointment'
                      )}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Grid>
      <ClientSearchModal
        isOpen={isClientSearchModalOpen}
        onClose={() => setIsClientSearchModalOpen(false)}
        title="Search Client"
        handleSubmitClientInfo={handleSubmitClientInfo}
        submittingClientInfo={submittingClientInfo}
      />
    </Grid>
  );
}
