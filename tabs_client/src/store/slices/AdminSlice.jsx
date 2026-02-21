import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin_slice',
  initialState: {
    id: null,
    legalName: null,
    gstNo: null,
    name: null,
    isDoctor: false,
    experience: null,
    proffessinalCourse: null,
    phone: null,
    altPhone: null,
    email: null,
    address: null,
    tenantId: null,
    workingDays: null,
    timings: null
  },
  reducers: {
    captureAdminDetails: (state, action) => {
      state.id = action.payload.id;
      state.legalName = action.payload.legalName;
      state.gstNo = action.payload.gstNo;
      state.name = action.payload.name;
      state.isDoctor = action.payload.isDoctor;
      state.experience = action.payload.experience;
      state.proffessinalCourse = action.payload.proffessinalCourse;
      state.phone = action.payload.phone;
      state.altPhone = action.payload.altPhone;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.tenantId = action.payload.tenantId;
      state.workingDays = action.payload.workingDays;
      state.timings = action.payload.timings;
    }
  }
});

export const adminSliceActions = adminSlice.actions;

const adminSliceReducers = adminSlice.reducer;
export default adminSliceReducers;
