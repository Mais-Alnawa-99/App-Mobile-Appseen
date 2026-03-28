import {createSlice} from '@reduxjs/toolkit';
import {getProductDetails} from '../thunk/detailsThunk';

const initialState = {
  productDetails: {},
  loadingDetails: true,
};

const productDetails = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getProductDetails.pending, (state, action) => {
      state.loadingDetails = true;
    }),
      builder.addCase(getProductDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.productDetails = action.payload?.result?.data;
      }),
      builder.addCase(getProductDetails.rejected, (state, action) => {
        state.loadingDetails = false;
      }));
  },
});

export default productDetails.reducer;
