import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addToCart} from '../thunk/add';

interface dataType {
  success: null;
  cartQuantity: number;
  msg: string;
  addToCartError: boolean;
  addToCartLoading: boolean;
}

const initialState: dataType = {
  success: null,
  cartQuantity: 0,
  addToCartError: false,
  addToCartLoading: false,
  msg: '',
};

const addToCartSlice = createSlice({
  name: 'addToCart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(addToCart.pending, (state, action) => {
      state.addToCartLoading = true;
      state.addToCartError = false;
    }),
      builder.addCase(addToCart.fulfilled, (state, action) => {
        state.addToCartLoading = false;
        state.success = action?.payload?.result?.data?.success;
        state.cartQuantity = action?.payload?.result?.data?.cart_quantity || 0;
        state.msg = action?.payload?.result?.data?.msg || '';
      }),
      builder.addCase(addToCart.rejected, (state, action) => {
        state.addToCartLoading = false;
        state.addToCartError = true;
      }));
  },
});
export default addToCartSlice.reducer;
