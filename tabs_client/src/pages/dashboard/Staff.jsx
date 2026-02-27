import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import StaffTable from '../../sections/dashboard/default/StaffTable';
import { toast } from 'react-toastify';
import DashboardHeading from '../../components/DashboardHeading';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router';
import CheckMissingInfo from '../../components/CheckMissingInfo';
import NoInfo from '../../components/NoInfo';

export default function DashboardStaff() {
  const { tenantId } = useSelector((state) => state.tenant_slice);
  const { services } = useSelector((state) => state.service_slice);
  const { locations } = useSelector((state) => state.location_slice);
  const { legalName, phone, altPhone, address, name, email } = useSelector((state) => state.admin_slice);
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
  const navigate = useNavigate();

  const fetchAllStaff = async () => {
    try {
      setFetchingAllStaff(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}fetch-staff?page=${page}&limit=${limit}&uid=${tenantId}`, {
        withCredentials: true
      });

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

  const editStaff = async (staffId) => {
    navigate(`/dashboard/staff/edit/${staffId}`);
  };

  const deleteAStaff = async (staffId) => {
    try {
      const confirmation = confirm('Do you really want to delete the staff?');
      if (!confirmation) return;
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}delete-a-staff/${staffId}?uid=${tenantId}`, {
        withCredentials: true
      });
      setDeletingAStaff(true);

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
    if (locations.length > 0) {
      fetchAllStaff();
    }
  }, [page, pagination.totalStaff]);

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
      {fetchingAllStaff ? (
        <Loader />
      ) : (
        <>
          {staff.length > 0 ? (
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
              <Grid item xs={12} md={8} lg={6}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <DashboardHeading
                    title={`All Staff (${pagination.totalStaff < 10 ? `0${pagination.totalStaff}` : pagination.totalStaff})`}
                  />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                  <StaffTable
                    staff={staff}
                    editStaff={editStaff}
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
