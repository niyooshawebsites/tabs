import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const ClientSearchModal = ({ isOpen, onClose, title, handleSubmitClientInfo, submittingClientInfo }) => {
  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number')
  });

  // ✅ Initial form values
  const initialValues = {
    phone: ''
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitClientInfo}>
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            <DialogContent dividers>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Remarks */}
                <TextField
                  label="phone"
                  name="phone"
                  multiline
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                  placeholder="Search by phone number..."
                  fullWidth
                  required
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={submittingClientInfo}>
                {submittingClientInfo ? 'Searching...' : 'Search'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ClientSearchModal;
