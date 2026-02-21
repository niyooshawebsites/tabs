import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { tenantSliceActions } from '../../store/slices/TenantSlice';
import { serviceSliceActions } from '../../store/slices/ServiceSlice';
import { announcementSliceActions } from '../../store/slices/AnnouncementSlice';
import { locationSliceActions } from '../../store/slices/LocationSlice';
import detectSubDomain from '../../utils/detectSubDomain';
import { toast } from 'react-toastify';

export default function LogoMain() {
  const subDomain = detectSubDomain();
  const { page, limit } = useSelector((state) => state.service_slice);
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const dispatch = useDispatch();

  const fetchTenantDetails = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}does-tenant-exist?username=${subDomain}`, {
        withCredentials: true
      });

      if (data.success) {
        dispatch(
          tenantSliceActions.captureTenantDetails({
            tenantId: data?.data?.id
          })
        );
      }

      if (!data.success) {
        toast.error('You are not registered with us. Register first.');
        navigate('/register');
      }
    } catch (err) {
      console.log(err.message);
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Multiple validation errors (Zod)
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        // Generic error
        const errorMessage = errorData?.message || 'Something went wrong';
        console.log(errorMessage);
      }
    }
  };

  const fetchAllLocations = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });

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

  const fetchAllServices = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-services?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });
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

  const fetchAnnouncement = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-announcement?uid=${tenantId}`, { withCredentials: true });
      if (data.success) {
        dispatch(
          announcementSliceActions.captureAnnouncementDetails({
            announcement: data?.announcement
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (subDomain) {
      fetchTenantDetails();

      if (tenantId !== null) {
        fetchAllLocations();
        fetchAnnouncement();
        fetchAllServices();
      }
    }
  }, [subDomain, tenantId]);

  return (
    <>
      <Typography variant="h1" color="primary">
        BYAO
      </Typography>
    </>
  );
}
