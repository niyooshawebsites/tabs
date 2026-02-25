import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ServicesTable from '../../sections/dashboard/default/ServicesTable';
import { toast } from 'react-toastify';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router';
import { serviceSliceActions } from '../../store/slices/ServiceSlice';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';

export default function DashboardServices() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services, page, limit } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [fetchingAllServices, serFetchingAllServices] = useState(false);
  const [pagination, setPagination] = useState({});
  const [deletingService, serDeletingService] = useState(false);
  const [serviceDeleted, setServiceDeleted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAllServices = async () => {
    try {
      serFetchingAllServices(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-services?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });

      if (data.success) {
        setPagination(data?.pagination);
        dispatch(
          serviceSliceActions.captureServiceDetails({
            services: data?.data,
            totalServices: data?.pagination.totalServices,
            totalPages: data?.pagination?.totalPages,
            hasNextPage: data?.pagination?.hasNextPage,
            hasPrevPage: data?.pagination?.hasPrevPage,
            limit: data?.pagination?.limit,
            page: data?.pagination?.page
          })
        );
        serFetchingAllServices(false);
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
      serFetchingAllServices(false);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const editService = async (sid) => {
    navigate(`/dashboard/service/edit/${sid}`);
  };

  const deleteService = async (sid) => {
    try {
      const confirmation = confirm(
        'If you delete the service, all Appointments will be deleted automatically. Do you really want to delete the service?'
      );
      if (!confirmation) return;

      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}delete-service/${sid}?uid=${tenantId}`, {
        withCredentials: true
      });

      serDeletingService(true);

      if (data.success) {
        toast.success(data.message);
        setServiceDeleted((prev) => !prev);
        serDeletingService(true);
      }
    } catch (err) {
      console.log(err);

      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData?.message || 'Something went wrong');
      }
    }

    serDeletingService(false);
  };

  useEffect(() => {
    fetchAllServices();
  }, [serviceDeleted]);

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  if (locations.length === 0) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  if (services.length === 0) {
    return CheckMissingInfo(legalName, phone, altPhone, address, name, email, locations, services);
  }

  return (
    <>
      {fetchingAllServices ? (
        <Loader />
      ) : (
        <>
          {services.length > 0 ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid item xs={12} md={8} lg={6}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <DashboardHeading
                    title={`All Services (${pagination.totalServices < 10 ? `0${pagination.totalServices}` : pagination.totalServices})`}
                  />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                  <ServicesTable
                    services={services}
                    editService={editService}
                    deleteService={deleteService}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    pagination={pagination}
                    page={page}
                    deletingService={deletingService}
                  />
                </MainCard>
              </Grid>
            </Grid>
          ) : (
            <NoInfo />
          )}
        </>
      )}
    </>
  );
}
