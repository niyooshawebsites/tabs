import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { locationSliceActions } from '../../../../store/slices/LocationSlice';
import { serviceSliceActions } from '../../../../store/slices/ServiceSlice';
import { toast } from 'react-toastify';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const dispatch = useDispatch();
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { empId, role } = useSelector((state) => state.login_slice);
  const { tenantId } = useSelector((state) => state.tenant_slice);

  const fetchAllLocations = async (tid) => {
    try {
      let response;
      try {
        // original request
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-staff-locations?page=1&limit=10&empId=${empId}&tid=${tid}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-staff-locations?page=1&limit=10&empId=${empId}&tid=${tid}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        dispatch(
          locationSliceActions.captureLocationDetails({
            locations: data?.data,
            totalLocations: data?.pagination?.totalLocations,
            totalPages: data?.pagination?.totalPages,
            hasNextPage: data?.pagination?.hasNextPage,
            hasPrevPage: data?.pagination?.hasPrevPage,
            limit: data?.pagination?.limit,
            page: data?.pagination?.page
          })
        );
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
    }
  };

  const fetchAllServices = async (tid) => {
    try {
      let response;

      try {
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-staff-services?page=1&limit=10&empId=${empId}&tid=${tid}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-staff-services?page=1&limit=10&empId=${empId}&tid=${tid}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        dispatch(
          serviceSliceActions.captureServiceDetails({
            services: data?.data,
            totalServices: data?.pagination?.totalServices,
            totalPages: data?.pagination?.totalPages,
            hasNextPage: data?.pagination?.hasNextPage,
            hasPrevPage: data?.pagination?.hasPrevPage,
            limit: data?.pagination?.limit,
            page: data?.pagination?.page
          })
        );
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) errorData.errors.forEach((msg) => toast.error(msg));
      else toast.error(errorData?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (role == 1) {
      fetchAllServices(tenantId);
      fetchAllLocations(tenantId);
    }
  }, [empId]);

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <Notification /> */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
