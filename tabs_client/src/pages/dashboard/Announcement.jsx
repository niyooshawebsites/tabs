import { Breadcrumbs, Grid, Stack, Typography, Button, Box } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import DashboardHeading from '../../components/DashboardHeading';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import { announcementSliceActions } from '../../store/slices/AnnouncementSlice';

export default function DashboardAnnouncement() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { announcement } = useSelector((state) => state.announcement_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
  const [deletingannouncement, setDeletingannouncement] = useState(false);
  const dispatch = useDispatch();

  const deleteAnnouncement = async (aid) => {
    try {
      setDeletingannouncement(true);
      const confirmation = confirm('Do you want to delete it? ');
      if (!confirmation) return;
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}delete-announcement/${aid}?uid=${tenantId}`, {
        withCredentials: true
      });

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
      {announcement ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack sx={{ gap: 3 }}>
              <DashboardHeading title="Announcement Details" />

              <MainCard title="Announcement">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography variant="h6">{announcement?.message || 'No Data'}</Typography>
                </Breadcrumbs>
              </MainCard>

              <MainCard title="Announcement Date">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography variant="h6">
                    {announcement?.createdAt ? moment(announcement.createdAt).format('DD-MM-YYYY') : 'No Data'}
                  </Typography>
                </Breadcrumbs>
              </MainCard>

              <MainCard title="Announcement Time">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography variant="h6">
                    {announcement?.createdAt ? moment(announcement.createdAt).format('HH:mm') : 'No Data'}
                  </Typography>
                </Breadcrumbs>
              </MainCard>

              <Button
                sx={{ p: 1, cursor: 'pointer' }}
                disabled={announcement == null || deletingannouncement}
                onClick={() => deleteAnnouncement(announcement?._id)}
                color="error"
              >
                {deletingannouncement ? 'Deleting Announcement...' : 'Delete Announcement'}
              </Button>
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
