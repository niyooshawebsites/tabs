import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service_slice',
  initialState: {
    services: [],
    totalServices: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    page: 1
  },
  reducers: {
    captureServiceDetails: (state, action) => {
      state.services = action.payload.services;
      state.totalServices = action.payload.totalServices;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPrevPage = action.payload.hasPrevPage;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    }
  }
});

export const serviceSliceActions = serviceSlice.actions;

const serviceSliceReducers = serviceSlice.reducer;
export default serviceSliceReducers;
