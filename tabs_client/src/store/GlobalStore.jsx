import { configureStore } from '@reduxjs/toolkit';
import loginSliceReducers from './slices/LoginSlice';
import adminSliceReducers from './slices/AdminSlice';
import appointmentStatusSliceReducers from './slices/AppointmentStatusSlice';
import tenantSliceReducers from './slices/TenantSlice';
import serviceSliceReducers from './slices/ServiceSlice';
import announcementSliceReducers from './slices/AnnouncementSlice';
import locationSliceReducers from './slices/LocationSlice';

const GlobalStore = configureStore({
  reducer: {
    login_slice: loginSliceReducers,
    admin_slice: adminSliceReducers,
    appointment_status_slice: appointmentStatusSliceReducers,
    tenant_slice: tenantSliceReducers,
    service_slice: serviceSliceReducers,
    announcement_slice: announcementSliceReducers,
    location_slice: locationSliceReducers
  }
});

export default GlobalStore;
