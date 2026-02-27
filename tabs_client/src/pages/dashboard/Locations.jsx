import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import LocationTable from '../../sections/dashboard/default/LocationTable';
import { toast } from 'react-toastify';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';
import { locationSliceActions } from '../../store/slices/LocationSlice';

export default function DashboardLocations() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations, page, limit } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [fetchingAllLocations, setFetchingAllLocations] = useState(false);
  const [pagination, setPagination] = useState({});
  const [deletingLocation, setDeletingLocation] = useState(false);
  const [loationDeleted, setLoationDeleted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const editLocation = async (lid) => {
    navigate(`/dashboard/location/edit/${lid}`);
  };

  const fetchAllLocations = async () => {
    try {
      setFetchingAllLocations(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });

      if (data.success) {
        setPagination(data?.pagination);
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

        setFetchingAllLocations(false);
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
      setFetchingAllLocations(false);
    }
  };

  const deleteLocation = async (lid) => {
    try {
      const confirmation = confirm(
        'If you delete the location, then all appointments, clients and services related to the location will be deleted as well. Do you really want to delete the location?'
      );

      if (!confirmation) return;
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}delete-a-location/${lid}?uid=${tenantId}`, {
        withCredentials: true
      });

      setDeletingLocation(true);

      if (data.success) {
        toast.success(data.message);
        setLoationDeleted((prev) => !prev);
        setDeletingLocation(false);
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
      setDeletingLocation(false);
    }
  };

  useEffect(() => {
    fetchAllLocations();
  }, [loationDeleted]);

  if (legalName == null || phone == null || altPhone == null || address == null || name == null || email == null) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  if (locations.length === 0) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  if (services.length === 0) {
    return (
      <CheckMissingInfo
        legalName={legalName}
        phone={phone}
        altPhone={altPhone}
        address={address}
        name={name}
        email={email}
        locations={locations}
        services={services}
      />
    );
  }

  return (
    <>
      {fetchingAllLocations ? (
        <Loader />
      ) : (
        <>
          {locations.length > 0 ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid item xs={12} md={8} lg={6}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <DashboardHeading
                    title={`All Locations (${pagination.totalLocations < 10 ? `0${pagination.totalLocations}` : pagination.totalLocations})`}
                  />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                  <LocationTable
                    locations={locations}
                    editLocation={editLocation}
                    deleteLocation={deleteLocation}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    pagination={pagination}
                    page={page}
                    deletingLocation={deletingLocation}
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
