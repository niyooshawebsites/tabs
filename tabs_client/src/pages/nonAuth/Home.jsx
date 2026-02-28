import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Ticker from '../../components/Ticker';
import AuthWrapper from 'sections/auth/AuthWrapper';
import NonAuthWrapper from 'sections/auth/NonAuthWrapper';
import SlotsSearchModal from '../../components/SlotsSearchModal';
import ShowSlotsModal from '../../components/ShowSlotsModal';
import { useSelector } from 'react-redux';
import states from '../../constants/states';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import UsernameLoginPage from '../../sections/auth/UsernameLoginPage';

export default function Home() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { announcement } = useSelector((state) => state.announcement_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [bookingAppointment, setBookingAppointment] = useState(false);
  const [isSlotsSearchModalOpen, setIsSlotsSearchModalOpen] = useState(false);
  const [isShowSlotsModalOpen, setIsShowSlotsModalOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [hideServiceDetails, setHideServiceDetails] = useState(true);
  const { subDomain } = useSelector((state) => state.subDomain_slice);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setBookingAppointment(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}book-appointment?uid=${tenantId}`, values, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message);
        resetForm();

        setSelectedService('');
        setSelectedLocation('');
        setSelectedDate('');
        setSelectedTime('');
        setHideServiceDetails(true);

        setTimeout(() => {
          navigate(`/search/appointment/${data?.data?.appointment?._id}`);
        }, 100);
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) errorData.errors.forEach((msg) => toast.error(msg));
      else toast.error(errorData?.message || 'Something went wrong');
    } finally {
      setBookingAppointment(false);
      setSubmitting(false);
    }
  };

  if (subDomain && tenantId) {
    const validationSchema = Yup.object({
      service: Yup.string().required('Service is required'),
      location: Yup.string().required('Location is required'),
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
        .required('Pincode is required'),
      notes: Yup.string()
    });

    const initialValues = {
      service: selectedService,
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      name: '',
      gender: '',
      dob: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      notes: ''
    };

    if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
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
      <NonAuthWrapper>
        <Grid container spacing={3}>
          <Grid size={12}>
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
              <Typography variant="h3">{legalName}</Typography>

              <Typography
                variant="body1"
                color="primary"
                sx={{
                  textDecoration: 'none',
                  alignSelf: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setIsSlotsSearchModalOpen(true)}
              >
                Select Service Details
              </Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            {announcement?.message ? <Ticker msg={announcement?.message} /> : ''}
            <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, handleChange, touched, errors }) => (
                <Form>
                  {/* Service Details */}
                  {hideServiceDetails ? null : (
                    <Box>
                      <Typography variant="h6" mb={1}>
                        Service Details
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Column 1 - Service */}
                        <Grid size={{ xs: 12, md: 3 }}>
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

                        <Grid size={{ xs: 12, md: 3 }}>
                          <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                              name="location"
                              value={values.location}
                              label="Location"
                              onChange={handleChange}
                              error={touched.location && Boolean(errors.location)}
                            >
                              <MenuItem value="">Select Location</MenuItem>
                              {locations.map((location) => (
                                <MenuItem key={location._id} value={location._id}>
                                  {location.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.location && errors.location && (
                              <Typography color="error" variant="caption">
                                {errors.location}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        {/* Column 2 - Date */}
                        <Grid size={{ xs: 12, md: 3 }}>
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
                        <Grid size={{ xs: 12, md: 3 }}>
                          <TextField
                            fullWidth
                            type="text"
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
                    </Box>
                  )}

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

                  {/* Appointment Notes */}
                  <Box mt={5}>
                    <Typography variant="h6">Appointment Notes</Typography>
                    <TextField name="notes" value={values.notes} label="Type here" multiline rows={2} fullWidth />
                  </Box>

                  {/* Submit Button */}
                  <Box mt={5}>
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={bookingAppointment}>
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

        <SlotsSearchModal
          isOpen={isSlotsSearchModalOpen}
          setIsSlotsSearchModalOpen={setIsSlotsSearchModalOpen}
          setIsShowSlotsModalOpen={setIsShowSlotsModalOpen}
          onClose={() => setIsSlotsSearchModalOpen(false)}
          title="Search Available Time Slots"
          setSlots={setSlots}
          services={services}
          locations={locations}
          tenantId={tenantId}
          setSelectedDate={setSelectedDate}
          setSelectedService={setSelectedService}
          setSelectedLocation={setSelectedLocation}
        />

        <ShowSlotsModal
          isOpen={isShowSlotsModalOpen}
          setIsShowSlotsModalOpen={setIsShowSlotsModalOpen}
          onClose={() => setIsShowSlotsModalOpen(false)}
          title="Available Time Slots"
          slots={slots}
          setSlots={setSlots}
          setSelectedTime={setSelectedTime}
          setHideServiceDetails={setHideServiceDetails}
        />
      </NonAuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">My Account</Typography>
            <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              <span sx={{ color: 'blue' }}>Register FREE</span>
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <UsernameLoginPage />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
