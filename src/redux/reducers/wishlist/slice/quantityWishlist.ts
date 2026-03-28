import {createSlice} from '@reduxjs/toolkit';

const quantityWishlist = createSlice({
  name: 'quantityWishlist',
  initialState: {
    quantityInWishlist: 0,
  },
  reducers: {
    setQuantityWishlist: (state, action) => {
      state.quantityInWishlist =
        action.payload && action.payload?.quantityInWishlist;
    },
    clearQuantityWishlist: state => {
      state.quantityInWishlist = 0;
    },
  },
});

export const {setQuantityWishlist, clearQuantityWishlist} =
  quantityWishlist.actions;
export default quantityWishlist.reducer;
