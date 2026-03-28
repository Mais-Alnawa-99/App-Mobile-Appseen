import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {quantityItemsInCart} from '../thunk/quantityCart';

interface dataType {
  success: null;
  cartQuantity: number;
  quantityError: boolean;
  quantityLoading: boolean;
}

const initialState: dataType = {
  success: null,
  cartQuantity: 0,
  quantityError: false,
  quantityLoading: false,
};

const quantityInCartSlice = createSlice({
  name: 'quantityInCart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(quantityItemsInCart.pending, (state, action) => {
      state.quantityLoading = true;
      state.quantityError = false;
    }),
      builder.addCase(quantityItemsInCart.fulfilled, (state, action) => {
        state.quantityLoading = false;
        state.success = action?.payload?.result?.data?.success;
        state.cartQuantity = action?.payload?.result?.data?.cart_quantity || 0;
      }),
      builder.addCase(quantityItemsInCart.rejected, (state, action) => {
        state.quantityLoading = false;
        state.quantityError = true;
      }));
  },
});
export default quantityInCartSlice.reducer;
