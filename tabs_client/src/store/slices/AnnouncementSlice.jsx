import { createSlice } from '@reduxjs/toolkit';

const announcementSlice = createSlice({
  name: 'announcement_slice',
  initialState: {
    announcement: null
  },
  reducers: {
    captureAnnouncementDetails: (state, action) => {
      state.announcement = action.payload.announcement;
    }
  }
});

export const announcementSliceActions = announcementSlice.actions;

const announcementSliceReducers = announcementSlice.reducer;
export default announcementSliceReducers;
