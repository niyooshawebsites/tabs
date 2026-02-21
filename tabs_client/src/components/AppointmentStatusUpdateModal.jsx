import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
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

const AppointmentStatusUpdateModal = ({ isOpen, onClose, title }) => {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { aid } = useSelector((state) => state.appointment_status_slice);
  const [loading, setLoading] = useState(false);

  // ✅ Validation schema using Yup
  const validationSchema = Yup.object().shape({
    status: Yup.string().required('Status is required'),
    date: Yup.string().when('status', {
      is: 'Rescheduled',
      then: (schema) => schema.required('Date is required for rescheduling'),
      otherwise: (schema) => schema.notRequired()
    }),
    time: Yup.string().when('status', {
      is: 'Rescheduled',
      then: (schema) => schema.required('Time is required for rescheduling'),
      otherwise: (schema) => schema.notRequired()
    }),
    remarks: Yup.string().required('Remarks are required')
  });

  // ✅ Initial form values
  const initialValues = {
    status: 'Pending',
    date: '',
    time: '',
    remarks: ''
  };

  // ✅ Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}update-appointment/${aid}?uid=${tenantId}`, values, {
        withCredentials: true
      });

      if (data.success) {
        toast.success('Appointment status updated');
        onClose(); // instead of setIsModalOpen(false)
        resetForm();
      }
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            <DialogContent dividers>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Status */}
                <FormControl fullWidth required error={touched.status && !!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select name="status" label="Status" value={values.status} onChange={handleChange} onBlur={handleBlur}>
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="No-Show">No-Show</MenuItem>
                    <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                  {touched.status && errors.status && (
                    <Box color="error.main" fontSize={12} mt={0.5}>
                      {errors.status}
                    </Box>
                  )}
                </FormControl>

                {/* Reschedule Fields */}
                {values.status === 'Rescheduled' && (
                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date (MM/DD/YYYY)"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                      error={touched.date && !!errors.date}
                      helperText={touched.date && errors.date}
                      required
                    />
                    <TextField
                      fullWidth
                      type="time"
                      label="Time"
                      name="time"
                      value={values.time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                      error={touched.time && !!errors.time}
                      helperText={touched.time && errors.time}
                      required
                    />
                  </Box>
                )}

                {/* Remarks */}
                <TextField
                  label="Remarks"
                  name="remarks"
                  multiline
                  rows={4}
                  value={values.remarks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.remarks && !!errors.remarks}
                  helperText={touched.remarks && errors.remarks}
                  placeholder="Add remarks about the status update..."
                  fullWidth
                  required
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AppointmentStatusUpdateModal;
