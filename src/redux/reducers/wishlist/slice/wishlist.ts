import {createSlice} from '@reduxjs/toolkit';
import {getWishlist} from '../thunk/wishList';

interface dataType {
  wishlistData: any;
  count: number;
  wishlistUpdateNeeded: boolean;
  wishlistError: boolean;
  wishlistLoading: boolean;
}

const initialState: dataType = {
  wishlistData: [],
  count: 0,
  wishlistUpdateNeeded: false,
  wishlistError: false,
  wishlistLoading: false,
};

const WishlistSlice = createSlice({
  name: 'DisplayWishlist',
  initialState,
  reducers: {
    setWishlistUpdateNeeded: (state, action) => {
      state.wishlistUpdateNeeded = action?.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getWishlist.pending, (state, action) => {
      state.wishlistLoading = true;
    });
    builder.addCase(getWishlist.fulfilled, (state, action) => {
      state.wishlistLoading = false;
      state.wishlistData = action?.payload?.result?.data?.prod;
      state.count = action?.payload?.result?.data?.count;
    });
    builder.addCase(getWishlist.rejected, (state, action) => {
      state.wishlistLoading = false;
      state.wishlistError = true;
    });
  },
});

export const {setWishlistUpdateNeeded} = WishlistSlice.actions;
export default WishlistSlice.reducer;
