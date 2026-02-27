import { useMemo, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { adminSliceActions } from '../../../store/slices/AdminSlice';
import { toast } from 'react-toastify';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const { subDomain } = useSelector((state) => state.subDomain_slice);
  const { phone, email } = useSelector((state) => state.admin_slice);
  const dispatch = useDispatch();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const fetchAdminDetails = async () => {
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

  useEffect(() => {
    if (subDomain) {
      if (phone == null || email == null) fetchAdminDetails();
    }
  }, [subDomain]);

  // common header
  const mainHeader = (
    <Toolbar>
      <IconButton
        aria-label="open drawer"
        onClick={() => handlerDrawerOpen(!drawerOpen)}
        edge="start"
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: drawerOpen ? 'transparent' : 'grey.100',
          ...theme.applyStyles('dark', { bgcolor: drawerOpen ? 'transparent' : 'background.default' }),
          ml: { xs: 0, lg: -2 }
        })}
      >
        {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
      zIndex: 1200,
      width: { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)` }
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}
