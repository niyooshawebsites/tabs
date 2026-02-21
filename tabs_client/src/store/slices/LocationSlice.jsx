import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location_slice',
  initialState: {
    locations: [],
    totalLocations: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    page: 1
  },
  reducers: {
    captureLocationDetails: (state, action) => {
      state.locations = action.payload.locations;
      state.totalLocations = action.payload.totalLocations;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPrevPage = action.payload.hasPrevPage;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    }
  }
});

export const locationSliceActions = locationSlice.actions;

const locationSliceReducers = locationSlice.reducer;
export default locationSliceReducers;
