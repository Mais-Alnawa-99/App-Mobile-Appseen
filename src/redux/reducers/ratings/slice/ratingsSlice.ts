import {createSlice} from '@reduxjs/toolkit';
import {getProductRatings} from '../thunk/ratingsThunk';

interface ProductRatingsState {
  productRatings: any;
  productRatingsCount: number;
  ratingStars: any;
  loadingRatings: boolean;
}

const initialState: ProductRatingsState = {
  productRatings: {},
  productRatingsCount: 0,
  ratingStars: {},
  loadingRatings: true,
};

const productRatings = createSlice({
  name: 'productRatings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getProductRatings.pending, (state, action) => {
      state.loadingRatings = true;
    }),
      builder.addCase(getProductRatings.fulfilled, (state, action) => {
        state.loadingRatings = false;
        state.productRatings = action.payload?.result?.data;
        state.productRatingsCount = action.payload?.result?.count;
        state.ratingStars = action.payload?.result?.rating_stars;
      }),
      builder.addCase(getProductRatings.rejected, (state, action) => {
        state.loadingRatings = false;
      }));
  },
});

export default productRatings.reducer;
