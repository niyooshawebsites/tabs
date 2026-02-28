import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { locationSliceActions } from '../../store/slices/LocationSlice';
import { serviceSliceActions } from '../../store/slices/ServiceSlice';
import { announcementSliceActions } from '../../store/slices/AnnouncementSlice';
import { tenantSliceActions } from '../../store/slices/TenantSlice';
import { subDomainSliceActions } from '../../store/slices/SubDomainSlice';
import { adminSliceActions } from '../../store/slices/AdminSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const TenantDetails = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    detectSubDomain();
  }, []);

  const fetchAdminDetails = async (subDomain) => {
    try {
      if (subDomain) {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-admin-details?username=${subDomain}`, {
          withCredentials: true
        });

        if (data.success) {
          dispatch(
            adminSliceActions.captureAdminDetails({
              id: data.data?._id,
              legalName: data.data?.legalName,
              gstNo: data.data?.gstNo,
              name: data.data?.name,
              isDoctor: data.data?.isDoctor,
              experience: data.data?.experience,
              proffessinalCourse: data.data?.proffessinalCourse,
              phone: data.data?.phone,
              altPhone: data.data?.altPhone,
              email: data.data?.email,
              address: data.data?.address,
              tenantId: data.data?.tenant,
              workingDays: data.data?.workingDays,
              timings: data.data?.timings
            })
          );
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
        console.log(errorMessage);
        toast.error('Profile is not updated');
      }
    }
  };

  const fetchAllLocations = async (tid) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=1&limit=10&uid=${tid}`, {
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

  const fetchAllServices = async (tid) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-services?page=1&limit=10&uid=${tid}`, {
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

  const fetchAnnouncement = async (tid) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-announcement?uid=${tid}`, { withCredentials: true });
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

  const fetchTenantDetails = async (subDomain) => {
    const adminDetailsSubDomain = subDomain;
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

        fetchAdminDetails(adminDetailsSubDomain);
        fetchAllLocations(data?.data?.id);
        fetchAllServices(data?.data?.id);
        fetchAnnouncement(data?.data?.id);
      }

      if (!data.success) {
        toast.error('You are not registered with us. Register first.');
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

  const detectSubDomain = () => {
    let subDomain;
    let hostname = window.location.hostname;

    // Ensure hostname includes 'www' if missing
    if (!hostname.startsWith('www.')) {
      hostname = 'www.' + hostname; //www.bookyourappointment.online or www.visooptica.bookyourappointment.online

      const parts = hostname.split('.');
      const isSubdomain = parts.length > 2;

      if (isSubdomain) {
        subDomain = parts[1];
        dispatch(
          subDomainSliceActions.captureSubDomainDetails({
            subDomain: subDomain
          })
        );
        subDomainSliceActions;
        fetchTenantDetails(subDomain);
      }
    }

    return subDomain;
  };

  return <></>;
};

export default TenantDetails;
