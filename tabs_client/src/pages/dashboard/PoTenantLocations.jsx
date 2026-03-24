import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LocationTable from '../../sections/dashboard/default/LocationTable';
import { toast } from 'react-toastify';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { useNavigate, useParams } from 'react-router';
import NoInfo from '../../components/NoInfo';

export default function PoDashboardLocations() {
  const { tid } = useParams();
  const [fetchingAllLocations, setFetchingAllLocations] = useState(false);
  const [pagination, setPagination] = useState({});
  const [deletingLocation, setDeletingLocation] = useState(false);
  const [loationDeleted, setLoationDeleted] = useState(false);
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
    let response;
    try {
      setFetchingAllLocations(true);

      try {
        // original request
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=${page}&limit=${limit}&uid=${tenantId}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-all-locations?page=${page}&limit=${limit}&uid=${tenantId}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        setPagination(data?.pagination);
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
      let response;
      setDeletingLocation(true);
      try {
        // original request
        response = await axios.delete(`${import.meta.env.VITE_API_URL}delete-a-location/${lid}?uid=${tenantId}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.delete(`${import.meta.env.VITE_API_URL}delete-a-location/${lid}?uid=${tenantId}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

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

  return (
    <>
      {fetchingAllLocations ? (
        <Loader />
      ) : (
        <>
          {locations.length > 0 ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid item xs={12} md={12} lg={12} width={'100%'}>
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
