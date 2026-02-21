import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login_slice',
  initialState: {
    uid: null,
    email: null,
    role: null,
    isAuthenticated: false,
    name: null,
    empId: null
  },
  reducers: {
    captureLoginDetails: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.name = action.payload.name;
      state.empId = action.payload.empId;
    }
  }
});

export const loginSliceActions = loginSlice.actions;

const loginSliceReducers = loginSlice.reducer;
export default loginSliceReducers;
