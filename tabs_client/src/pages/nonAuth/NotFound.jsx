import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Paper, Typography, Button, Grid } from '@mui/material';
import Loader from '../../components/Loader';
import NonAuthWrapper from '../../sections/auth/NonAuthWrapper';

const NotFound = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}check-auth`, { withCredentials: true });

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
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
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <NonAuthWrapper>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 5,
                  textAlign: 'center',
                  maxWidth: 400,
                  borderRadius: 2
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Page Not Found
                </Typography>

                <Typography variant="body1" sx={{ my: 2 }}>
                  The resource you are trying to access does not exist.
                </Typography>

                <Button variant="contained" component={Link} to={isAuthenticated ? '/dashboard' : '/'} sx={{ mt: 2 }}>
                  Go Back
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </NonAuthWrapper>
      )}
    </>
  );
};

export default NotFound;
