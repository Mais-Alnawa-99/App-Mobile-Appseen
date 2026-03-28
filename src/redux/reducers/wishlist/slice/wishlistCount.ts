import {createSlice} from '@reduxjs/toolkit';
import {quantityItemsInWishlist} from '../thunk/wishListCount';

interface dataType {
  wishListQuantity: number;
  wishlistError: boolean;
  wishlistLoading: boolean;
}

const initialState: dataType = {
  wishListQuantity: 0,
  wishlistError: false,
  wishlistLoading: false,
};

const quantityInWishlistSlice = createSlice({
  name: 'quantityInWishlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(quantityItemsInWishlist.pending, (state, action) => {
      state.wishlistLoading = true;
      state.wishlistError = false;
    }),
      builder.addCase(quantityItemsInWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishListQuantity = action?.payload?.result?.data?.count || 0;
      }),
      builder.addCase(quantityItemsInWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistError = true;
      }));
  },
});
export default quantityInWishlistSlice.reducer;
