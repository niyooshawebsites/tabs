import { createSlice } from '@reduxjs/toolkit';

const appointmentStatusSlice = createSlice({
  name: 'appointment_status_slice',
  initialState: {
    aid: null
  },
  reducers: {
    captureAppointmentIdForStatusUpdate: (state, action) => {
      state.aid = action.payload.aid;
    }
  }
});

export const appointmentStatusSliceActions = appointmentStatusSlice.actions;

const appointmentStatusSliceReducers = appointmentStatusSlice.reducer;
export default appointmentStatusSliceReducers;
