import { Grid, Stack, Typography, Button, Box } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeading from '../../components/DashboardHeading';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import { announcementSliceActions } from '../../store/slices/AnnouncementSlice';

export default function DashboardAnnouncement() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { announcement } = useSelector((state) => state.announcement_slice);
  const { id } = useSelector((state) => state.admin_slice);
  const [deletingannouncement, setDeletingannouncement] = useState(false);
  const dispatch = useDispatch();

  const deleteAnnouncement = async (aid) => {
    try {
      setDeletingannouncement(true);
      const confirmation = confirm('Do you want to delete it? ');
      if (!confirmation) return;
      let response;

      try {
        response = await axios.delete(`${import.meta.env.VITE_API_URL}delete-announcement/${aid}?uid=${tenantId}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.delete(`${import.meta.env.VITE_API_URL}delete-announcement/${aid}?uid=${tenantId}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        dispatch(announcementSliceActions.captureAnnouncementDetails({ announcement: null }));
        setDeletingannouncement(false);
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
        setDeletingannouncement(false);
      }
    }
  };

  if (!id) {
    return <CheckMissingInfo id={id} locations={locations} services={services} />;
  }

  if (locations.length == 0) {
    return <CheckMissingInfo id={id} locations={locations} services={services} />;
  }

  if (services.length == 0) {
    return <CheckMissingInfo id={id} locations={locations} services={services} />;
  }

  return (
    <>
      {announcement ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Stack sx={{ gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DashboardHeading title="Announcement Details" />
                <Button
                  sx={{ p: 1, cursor: 'pointer' }}
                  disabled={announcement == null || deletingannouncement}
                  onClick={() => deleteAnnouncement(announcement?._id)}
                  color="error"
                >
                  {deletingannouncement ? 'Deleting Announcement...' : 'Delete Announcement'}
                </Button>
              </Box>

              <Box className="details">
                <Typography variant="h6" className="details-heading">
                  Announcement
                </Typography>
                <Typography variant="h6">{announcement?.message || 'No Data'}</Typography>
              </Box>

              <Box className="details">
                <Typography variant="h6" className="details-heading">
                  Announcement Date & Time
                </Typography>
                <Typography variant="h6">
                  {announcement?.createdAt ? moment(announcement.createdAt).format('DD-MM-YYYY') : 'No Data'} |{' '}
                  {announcement?.createdAt ? moment(announcement.createdAt).format('HH:mm') : 'No Data'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ p: 1 }}>
          <Typography variant="p">No Annoucement</Typography>
        </Box>
      )}
    </>
  );
}
