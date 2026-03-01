import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Box
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const SlotsSearchModal = ({
  tenantId,
  services,
  locations,
  isOpen,
  onClose,
  title,
  setSlots,
  setIsSlotsSearchModalOpen,
  setIsShowSlotsModalOpen,
  setSelectedService,
  setSelectedLocation,
  setSelectedDate
}) => {
  const [loading, setLoading] = useState(false);

  // ✅ Validation schema using Yup
  const validationSchema = Yup.object().shape({
    sid: Yup.string().required('Service is required'),
    lid: Yup.string().required('Location is required'),
    date: Yup.string().required('Date is required')
  });

  // ✅ Initial form values
  const initialValues = {
    sid: '',
    lid: '',
    date: ''
  };

  const updateService = (value) => {
    setSelectedService(value);
  };

  const updateLocation = (value) => {
    setSelectedLocation(value);
  };

  const updateDate = (value) => {
    setSelectedDate(value);
  };

  const handleSubmitSlotsInfo = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}check-available-slots?uid=${tenantId}`, values, {
        withCredentials: true
      });

      if (data.success) {
        setSlots(data.data);
        setIsSlotsSearchModalOpen(false);
        setIsShowSlotsModalOpen(true);
        resetForm();
        setLoading(false);
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
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitSlotsInfo}>
        {({ values, handleBlur, setFieldValue, touched, errors }) => (
          <Form>
            <DialogContent dividers>
              <Box display="flex" flexDirection="column" gap={3}>
                <FormControl fullWidth required error={touched.sid && !!errors.sid}>
                  <InputLabel>Service</InputLabel>
                  <Select
                    name="sid"
                    label="Service"
                    value={values.sid}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFieldValue('sid', value);
                      updateService(value);
                    }}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name} - Rs {service.charges}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.sid && errors.sid && (
                    <Box color="error.main" fontSize={12} mt={0.5}>
                      {errors.sid}
                    </Box>
                  )}
                </FormControl>

                <FormControl fullWidth required error={touched.lid && !!errors.lid}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    name="lid"
                    label="Location"
                    value={values.lid}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFieldValue('lid', value);
                      updateLocation(value);
                    }}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="">Select Location</MenuItem>
                    {locations.map((location) => (
                      <MenuItem key={location._id} value={location._id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.lid && errors.lid && (
                    <Box color="error.main" fontSize={12} mt={0.5}>
                      {errors.lid}
                    </Box>
                  )}
                </FormControl>

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date (MM/DD/YYYY)"
                    name="date"
                    value={values.date}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFieldValue('date', value);
                      updateDate(value);
                    }}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    error={touched.date && !!errors.date}
                    helperText={touched.date && errors.date}
                    required
                  />
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Check Available Slots'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default SlotsSearchModal;
