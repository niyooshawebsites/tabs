import { createSlice } from '@reduxjs/toolkit';

const subDomainSlice = createSlice({
  name: 'subDomain_slice',
  initialState: {
    subDomain: null
  },
  reducers: {
    captureSubDomainDetails: (state, action) => {
      state.subDomain = action.payload.subDomain;
    }
  }
});

export const subDomainSliceActions = subDomainSlice.actions;

const subDomainSliceReducers = subDomainSlice.reducer;
export default subDomainSliceReducers;
