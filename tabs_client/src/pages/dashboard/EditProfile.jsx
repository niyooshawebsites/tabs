import {
  Grid,
  Stack,
  OutlinedInput,
  FormHelperText,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { adminSliceActions } from '../../store/slices/AdminSlice';
import DashboardHeading from '../../components/DashboardHeading';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DashboardEditProfile() {
  const { uid, role, isAuthenticated } = useSelector((state) => state.login_slice);
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { id } = useSelector((state) => state.admin_slice);
  const dispatch = useDispatch();
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    console.log('start test');
    console.log(uid, tenantId);
    console.log('end test');
    if (role === 3 && isAuthenticated) {
      try {
        setUpdatingProfile(true);

        const apiURL = id
          ? `${import.meta.env.VITE_API_URL}update-platform-owner-details?uid=${uid}`
          : `${import.meta.env.VITE_API_URL}add-platform-owner-details?uid=${uid}`;

        if (id) {
          const { data } = await axios.patch(apiURL, values, {
            withCredentials: true
          });

          if (data.success) {
            toast.success(data.message);

            dispatch(
              adminSliceActions.captureAdminDetails({
                id: data?.data?._id,
                legalName: data?.data?.legalName,
                gstNo: data?.data?.gstNo,
                name: data?.data?.name,
                isDoctor: data?.data?.isDoctor,
                experience: data?.data?.experience,
                proffessinalCourse: data?.data?.proffessinalCourse,
                phone: data?.data?.phone,
                altPhone: data?.data?.altPhone,
                email: data?.data?.email,
                address: data?.data?.address,
                tenantId: data?.data?.tenant,
                workingDays: data?.data?.workingDays,
                timings: data?.data?.timings
              })
            );
            resetForm();
            setUpdatingProfile(false);
          }
        } else {
          const { data } = await axios.post(apiURL, values, {
            withCredentials: true
          });
          if (data.success) {
            toast.success(data.message);
            resetForm();
            setUpdatingProfile(false);
          }
        }
      } catch (err) {
        console.log(err);
        const errorData = err.response?.data;

        if (errorData?.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((msg) => toast.error(msg));
        } else {
          const errorMessage = errorData?.message || 'Something went wrong';
          toast.error(errorMessage);
        }
        setUpdatingProfile(false);
      }
    }

    if (role === 2 && isAuthenticated) {
      try {
        setUpdatingProfile(true);

        const apiURL =
          id !== null
            ? `${import.meta.env.VITE_API_URL}update-admin-details?uid=${tenantId}`
            : `${import.meta.env.VITE_API_URL}add-admin-details?uid=${tenantId}`;

        if (id) {
          const { data } = await axios.patch(apiURL, values, {
            withCredentials: true
          });

          if (data.success) {
            toast.success(data.message);

            dispatch(
              adminSliceActions.captureAdminDetails({
                id: data?.data?._id,
                legalName: data?.data?.legalName,
                gstNo: data?.data?.gstNo,
                name: data?.data?.name,
                isDoctor: data?.data?.isDoctor,
                experience: data?.data?.experience,
                proffessinalCourse: data?.data?.proffessinalCourse,
                phone: data?.data?.phone,
                altPhone: data?.data?.altPhone,
                email: data?.data?.email,
                address: data?.data?.address,
                tenantId: data?.data?.tenant,
                workingDays: data?.data?.workingDays,
                timings: data?.data?.timings
              })
            );

            resetForm();
            setUpdatingProfile(false);
            navigate('/dashboard/settings/profile');
          }
        } else {
          const { data } = await axios.post(apiURL, values, {
            withCredentials: true
          });
          if (data.success) {
            toast.success(data.message);
            setUpdatingProfile(false);
            navigate('/dashboard/settings/profile');
          }
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
        setUpdatingProfile(false);
      }
    }
  };

  const validationSchema = Yup.object({
    legalName: Yup.string().required('Business name is required'),
    gstNo: Yup.string().required('GST number is required'),
    address: Yup.string().required('Address is required'),
    isDoctor: Yup.string().required('Please select an option'),
    experience: Yup.string().required('Experience is required'),
    proffessinalCourse: Yup.string().required('Professional course is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().min(10, 'Invalid phone').required('Phone is required'),
    altPhone: Yup.string().min(10, 'Invalid alternate phone'),
    workingDays: Yup.array().min(1, 'Select at least one working day').required(),
    timings: Yup.object().shape({
      shiftType: Yup.string().required('Select shift type')
    })
  });

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Grid container alignItems="center" justifyContent="start">
          <DashboardHeading title="Edit Service" />
        </Grid>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Formik
              initialValues={{
                legalName: '',
                gstNo: '',
                address: '',
                isDoctor: '',
                experience: '',
                proffessinalCourse: '',
                name: '',
                email: '',
                phone: '',
                altPhone: '',
                workingDays: [],
                timings: {
                  shiftType: '',
                  fullDay: { start: '', end: '' },
                  partDay: {
                    morningStart: '',
                    morningEnd: '',
                    eveningStart: '',
                    eveningEnd: ''
                  }
                }
              }}
              // key={JSON.stringify(adminDetails)}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, touched, errors }) => (
                <Form>
                  {/* Business Details */}
                  <Typography variant="h6" mb={1} sx={{ fontWeight: 'bold' }}>
                    Business Details
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Legal Details */}
                    {/* Column 1*/}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="legalName">Business name</InputLabel>
                        <OutlinedInput
                          type="text"
                          name="legalName"
                          value={values.legalName}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter your business name"
                          fullWidth
                          error={Boolean(touched.legalName && errors.legalName)}
                        />
                      </Stack>
                      {touched.legalName && errors.legalName && (
                        <FormHelperText error id="standard-weight-helper-text-legalName">
                          {errors.legalName}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Column 2*/}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 1 }}>
                        <InputLabel htmlFor="gstNo">GST Number</InputLabel>
                        <OutlinedInput
                          type="text"
                          name="gstNo"
                          value={values.gstNo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter your GST number"
                          fullWidth
                          error={Boolean(touched.gstNo && errors.gstNo)}
                        />
                      </Stack>
                      {touched.gstNo && errors.gstNo && (
                        <FormHelperText error id="standard-weight-helper-text-gstNo">
                          {errors.gstNo}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  {/* Professional Details */}
                  <Box mt={4}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="address">Address</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="address"
                            value={values.address}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your registered address"
                            fullWidth
                            error={Boolean(touched.address && errors.address)}
                          />
                        </Stack>
                        {touched.address && errors.address && (
                          <FormHelperText error id="standard-weight-helper-text-address">
                            {errors.address}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Are you a Doctor?</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              placeholder="Select"
                              name="isDoctor"
                              value={values.isDoctor}
                              label="Service"
                              onChange={handleChange}
                              error={touched.isDoctor && Boolean(errors.isDoctor)}
                            >
                              <MenuItem value="">Select</MenuItem>
                              <MenuItem value={'yes'}>Yes</MenuItem>
                              <MenuItem value={'no'}>No</MenuItem>
                            </Select>
                            {touched.isDoctor && errors.isDoctor && (
                              <Typography color="error" variant="caption">
                                {errors.isDoctor}
                              </Typography>
                            )}
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Professional Details */}
                  <Box mt={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Professional Details
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="experience">Experience (in years)</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="experience"
                            value={values.experience}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="12"
                            fullWidth
                            error={Boolean(touched.experience && errors.experience)}
                          />
                        </Stack>
                        {touched.experience && errors.experience && (
                          <FormHelperText error id="standard-weight-helper-text-experience">
                            {errors.experience}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="experience">Professional Course or Degree</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="proffessinalCourse"
                            value={values.proffessinalCourse}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your professional course"
                            fullWidth
                            error={Boolean(touched.proffessinalCourse && errors.proffessinalCourse)}
                          />
                        </Stack>
                        {touched.proffessinalCourse && errors.proffessinalCourse && (
                          <FormHelperText error id="standard-weight-helper-text-proffessinalCourse">
                            {errors.proffessinalCourse}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Contact Details */}
                  <Box mt={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Contact Details
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="name">Name</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="name"
                            value={values.name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            fullWidth
                            error={Boolean(touched.name && errors.name)}
                          />
                        </Stack>
                        {touched.name && errors.name && (
                          <FormHelperText error id="standard-weight-helper-text-name">
                            {errors.name}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="email">Email</InputLabel>
                          <OutlinedInput
                            type="email"
                            name="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your email id"
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                          />
                        </Stack>
                        {touched.email && errors.email && (
                          <FormHelperText error id="standard-weight-helper-text-email">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  <Box mt={4}>
                    <Grid container spacing={2} mt={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="phone">Phone</InputLabel>
                          <OutlinedInput
                            type="tel"
                            name="phone"
                            value={values.phone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            fullWidth
                            error={Boolean(touched.phone && errors.phone)}
                          />
                        </Stack>
                        {touched.phone && errors.phone && (
                          <FormHelperText error id="standard-weight-helper-text-phone">
                            {errors.phone}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel htmlFor="altPhone">Alternate Phone</InputLabel>
                          <OutlinedInput
                            type="tel"
                            name="altPhone"
                            value={values.altPhone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your alternate number"
                            fullWidth
                            error={Boolean(touched.altPhone && errors.altPhone)}
                          />
                        </Stack>
                        {touched.altPhone && errors.altPhone && (
                          <FormHelperText error id="standard-weight-helper-text-altPhone">
                            {errors.altPhone}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Service Details */}
                  <Box mt={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Working Days
                    </Typography>

                    <Grid container spacing={2}>
                      {WEEK_DAYS.map((day) => (
                        <Grid item xs={6} md={4} key={day}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                              type="checkbox"
                              name="workingDays"
                              checked={values.workingDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleChange({
                                    target: {
                                      name: 'workingDays',
                                      value: [...values.workingDays, day]
                                    }
                                  });
                                } else {
                                  handleChange({
                                    target: {
                                      name: 'workingDays',
                                      value: values.workingDays.filter((d) => d !== day)
                                    }
                                  });
                                }
                              }}
                            />
                            {day}
                          </label>
                        </Grid>
                      ))}
                    </Grid>

                    {touched.workingDays && errors.workingDays && <FormHelperText error>{errors.workingDays}</FormHelperText>}
                  </Box>

                  <Box mt={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Timings
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>Shift Type</InputLabel>
                      <Select
                        name="timings.shiftType"
                        value={values.timings.shiftType}
                        onChange={handleChange}
                        label="Shift Type"
                        error={touched.timings?.shiftType && Boolean(errors.timings?.shiftType)}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="full">Full Day Shift</MenuItem>
                        <MenuItem value="part">Part Day Shift</MenuItem>
                      </Select>
                    </FormControl>

                    {touched.timings?.shiftType && errors.timings?.shiftType && (
                      <FormHelperText error>{errors.timings.shiftType}</FormHelperText>
                    )}
                  </Box>

                  {values.timings.shiftType === 'full' && (
                    <Box mt={3} container flex={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Full Day Timings (applies to all selected working days)
                      </Typography>

                      <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} md={6}>
                          <Stack gap={1}>
                            <InputLabel>Start Time</InputLabel>
                            <OutlinedInput
                              type="time"
                              name="timings.fullDay.start"
                              value={values.timings.fullDay.start}
                              onChange={handleChange}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack gap={1}>
                            <InputLabel>End Time</InputLabel>
                            <OutlinedInput
                              type="time"
                              name="timings.fullDay.end"
                              value={values.timings.fullDay.end}
                              onChange={handleChange}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {values.timings.shiftType === 'part' && (
                    <Box mt={3} container flex={1}>
                      <Grid container spacing={2} mt={1} item xs={12} md={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Morning Shift
                        </Typography>
                        <Grid item xs={12} md={6}>
                          <Stack gap={1}>
                            <InputLabel>Morning Start</InputLabel>
                            <OutlinedInput
                              type="time"
                              name="timings.partDay.morningStart"
                              value={values.timings.partDay.morningStart}
                              onChange={handleChange}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack gap={1}>
                            <InputLabel>Morning End</InputLabel>
                            <OutlinedInput
                              type="time"
                              name="timings.partDay.morningEnd"
                              value={values.timings.partDay.morningEnd}
                              onChange={handleChange}
                            />
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} mt={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} mt={3}>
                          Evening Shift
                        </Typography>
                        <Grid item xs={12} md={6}>
                          <Stack gap={1}>
                            <InputLabel>Evening Start</InputLabel>
                            <OutlinedInput
                              type="time"
                              name="timings.partDay.eveningStart"
                              value={values.timings.partDay.eveningStart}
                              onChange={handleChange}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack gap={1}>
                            <InputLabel>Evening End</InputLabel>
                            <OutlinedInput
                              type="time"
                              name="timings.partDay.eveningEnd"
                              value={values.timings.partDay.eveningEnd}
                              onChange={handleChange}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  <Box mt={5}>
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={updatingProfile}>
                      {updatingProfile ? 'Updating Profile...' : 'Update Profile'}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
