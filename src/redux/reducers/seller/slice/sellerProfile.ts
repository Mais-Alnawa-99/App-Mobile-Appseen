import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { getSellerProfile } from '../thunk/sellerProfile';

interface dataType {
  sellerData: object;
  sellerError: boolean;
  sellerLoading: boolean;
}

const initialState: dataType = {
  sellerData: {},
  sellerError: false,
  sellerLoading: false,
};

const sellerProfileSlice = createSlice({
  name: 'sellerProfile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getSellerProfile.pending, (state, action) => {
      state.sellerLoading = true;
      state.sellerError = false;
    }),
      builder.addCase(getSellerProfile.fulfilled, (state, action) => {
        state.sellerLoading = false;
        state.sellerData = action?.payload?.result
      }),
      builder.addCase(getSellerProfile.rejected, (state, action) => {
        state.sellerLoading = false;
        state.sellerError = true;
      }));
  },
});
export default sellerProfileSlice.reducer;
