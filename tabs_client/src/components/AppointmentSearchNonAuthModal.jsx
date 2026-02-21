import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';

const AppointmentSearchNonAuthModal = ({ isOpen, onClose, title, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    aid: ''
  };

  // ✅ Conditional Yup validation
  const validationSchema = Yup.object().shape({
    aid: Yup.string().required('Appointment ID is required')
  });

  // ✅ Formik Submit Handler
  const handleSubmit = async (values) => {
    setLoading(true);
    navigate(`/search/appointment/${values.aid.trim()}`);
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

export default AppointmentSearchNonAuthModal;
