import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PoStaffTable from '../../sections/dashboard/default/PoStaffTable';
import { toast } from 'react-toastify';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { useNavigate, useParams } from 'react-router';
import NoInfo from '../../components/NoInfo';

export default function PoDashboardStaff() {
  const { tid } = useParams();
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState({
    totalStaff: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [fetchingAllStaff, setFetchingAllStaff] = useState(false);
  const [deletingAStaff, setDeletingAStaff] = useState(false);

  const fetchAllStaff = async () => {
    try {
      setFetchingAllStaff(true);
      let response;

      try {
        response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-tenant-staff-for-po?page=${page}&limit=${limit}&tid=${tid}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.get(`${import.meta.env.VITE_API_URL}fetch-tenant-staff-for-po?page=${page}&limit=${limit}&tid=${tid}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        setStaff(data.data);
        setPagination(data.pagination);
        setFetchingAllStaff(false);
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
      setFetchingAllStaff(false);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pagination.hasPrevPage) setPage((prev) => prev - 1);
  };

  const deleteAStaff = async (staffId) => {
    try {
      const confirmation = confirm('Do you really want to delete the staff?');
      if (!confirmation) return;
      setDeletingAStaff(true);
      let response;

      try {
        response = await axios.delete(`${import.meta.env.VITE_API_URL}delete-a-staff/${staffId}?uid=${tenantId}`, {
          withCredentials: true
        });
      } catch (error) {
        // If access token expired → refresh
        if (error.response?.status === 401) {
          await axios.post(`${import.meta.env.VITE_API_URL}refresh-token`, {}, { withCredentials: true });

          // Retry original request
          response = await axios.delete(`${import.meta.env.VITE_API_URL}delete-a-staff/${staffId}?uid=${tenantId}`, {
            withCredentials: true
          });
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        setStaff((prev) => prev.filter((staff) => staff._id !== staffId));
        setPagination((prev) => {
          return {
            ...prev,
            totalStaff: prev.totalStaff - 1
          };
        });

        setDeletingAStaff(false);
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
      setDeletingAStaff(false);
    }
  };

  useEffect(() => {
    fetchAllStaff();
  }, [page, pagination.totalStaff]);

  return (
    <>
      {fetchingAllStaff ? (
        <Loader />
      ) : (
        <>
          {staff.length > 0 ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid item xs={12} md={12} lg={12} width={'100%'}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <DashboardHeading
                    title={`All Staff (${pagination.totalStaff < 10 ? `0${pagination.totalStaff}` : pagination.totalStaff})`}
                  />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                  <PoStaffTable
                    staff={staff}
                    deleteStaff={deleteAStaff}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    pagination={pagination}
                    page={page}
                    deletingAStaff={deletingAStaff}
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
