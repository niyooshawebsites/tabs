import { useState } from 'react';
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
  Box
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';

const SearchModal = ({ isOpen, onClose, title, setIsModalOpen }) => {
  const { role, isAuthenticated } = useSelector((state) => state.login_slice);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    type: '',
    aid: '',
    clientInfo: ''
  };

  // ✅ Conditional Yup validation
  const validationSchema = Yup.object().shape({
    type: Yup.string().required('Search type is required'),

    aid: Yup.string().when('type', {
      is: 'Appointment',
      then: (schema) => schema.required('Appointment ID is required'),
      otherwise: (schema) => schema.strip() // 💥 FIX
    }),

    clientInfo: Yup.string().when('type', {
      is: 'Client',
      then: (schema) => schema.required('Client information is required'),
      otherwise: (schema) => schema.strip() // 💥 FIX
    })
  });

  // ✅ Formik Submit Handler
  const handleSubmit = async (values) => {
    setLoading(true);

    if (values.type === 'Appointment') {
      navigate(isAuthenticated && role ? `/dashboard/appointment/details/${values.aid}` : `/appointment/${values.aid}`);
    }

    if (values.type === 'Client') {
      navigate(`/dashboard/client/details/${values.clientInfo}`);
    }

    setLoading(false);
    setIsModalOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            <DialogContent dividers>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Search Type */}
                <FormControl fullWidth required error={touched.type && !!errors.type}>
                  <InputLabel>Search Type</InputLabel>
                  <Select name="type" label="Search Type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="Appointment">Appointment</MenuItem>
                    <MenuItem value="Client">Client</MenuItem>
                  </Select>

                  {touched.type && errors.type && (
                    <Box color="error.main" fontSize={12} mt={0.5}>
                      {errors.type}
                    </Box>
                  )}
                </FormControl>

                {/* Appointment Field */}
                {values.type === 'Appointment' && (
                  <TextField
                    label="Appointment ID"
                    name="aid"
                    value={values.aid}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.aid && !!errors.aid}
                    helperText={touched.aid && errors.aid}
                    placeholder="Enter Appointment ID"
                    fullWidth
                    required
                  />
                )}

                {/* Client Field */}
                {values.type === 'Client' && (
                  <TextField
                    label="Client ID or Contact Number"
                    name="clientInfo"
                    value={values.clientInfo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientInfo && !!errors.clientInfo}
                    helperText={touched.clientInfo && errors.clientInfo}
                    placeholder="Enter Client ID or Contact Number"
                    fullWidth
                    required
                  />
                )}
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default SearchModal;
