import { createSlice } from '@reduxjs/toolkit';

const tenantSlice = createSlice({
  name: 'tenant_slice',
  initialState: {
    tenantId: null
  },
  reducers: {
    captureTenantDetails: (state, action) => {
      state.tenantId = action.payload.tenantId;
    }
  }
});

export const tenantSliceActions = tenantSlice.actions;

const tenantSliceReducers = tenantSlice.reducer;
export default tenantSliceReducers;
