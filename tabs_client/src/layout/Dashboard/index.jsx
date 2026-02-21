import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loginSliceActions } from '../../store/slices/LoginSlice';
import useMediaQuery from '@mui/material/useMediaQuery';

import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

export default function DashboardLayout() {
  const { role } = useSelector((state) => state.login_slice);
  const dispatch = useDispatch();

  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // AUTH CHECK — RUNS ONLY ON MOUNT
  // ---------------------------------------------
  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}check-auth`, { withCredentials: true });

      if (data?.success) {
        dispatch(
          loginSliceActions.captureLoginDetails({
            uid: data.user?.uid,
            email: data.user?.email,
            role: data.user?.role,
            isAuthenticated: true,
            name: role == 3 ? data?.user?.name : null,
            empId: role == 3 ? data?.user?.empId : null
          })
        );
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      const errorData = err.response?.data;

      // Zod validation errors
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((e) => {
          toast.error(e?.message || e);
        });
      } else {
        const message = errorData?.message || 'Something went wrong';
        console.log(message);
      }

      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // RUN ONLY ON COMPONENT MOUNT
  useEffect(() => {
    checkAuth();
  }, []);

  // DRAWER RESPONSIVENESS
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  // LOADING STATE
  if (loading || menuMasterLoading) return <Loader />;

  // REDIRECT IF NOT AUTHENTICATED
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ---------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />

      <Box
        component="main"
        sx={{
          width: 'calc(100% - 260px)', // You can adjust based on drawer config
          flexGrow: 1,
          p: { xs: 2, sm: 3 }
        }}
      >
        <Toolbar sx={{ mt: 'inherit' }} />

        <Box
          sx={{
            px: { xs: 0, sm: 2 },
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
