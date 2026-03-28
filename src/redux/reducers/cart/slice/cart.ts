import {createSlice} from '@reduxjs/toolkit';
import {displayCart} from '../thunk/cart';

interface dataType {
  cartData: any;
  count: number;
  suggestedProducts: any;
  orderSummary: any;
  extraParams: any;
  cartUpdateNeeded: boolean;
  CartError: boolean;
  CartLoading: boolean;
}

const initialState: dataType = {
  cartData: [],
  count: 0,
  suggestedProducts: [],
  orderSummary: {},
  extraParams: {},
  cartUpdateNeeded: false,
  CartError: false,
  CartLoading: false,
};

const displayCartSlice = createSlice({
  name: 'DisplayCart',
  initialState,
  reducers: {
    setCartUpdatedNeeded: (state, action) => {
      state.cartUpdateNeeded = action?.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(displayCart.pending, (state, action) => {
      state.CartLoading = true;
    });
    builder.addCase(displayCart.fulfilled, (state, action) => {
      state.CartLoading = false;
      state.cartData = action?.payload?.result?.data?.cart_data;
      state.count = action?.payload?.result?.data?.count;
      state.suggestedProducts =
        action?.payload?.result?.data?.suggested_products;
      state.orderSummary = action?.payload?.result?.data?.order_summary;
      state.extraParams = action?.payload?.result?.data?.extra_params;
    });
    builder.addCase(displayCart.rejected, (state, action) => {
      state.CartLoading = false;
      state.CartError = true;
    });
  },
});

export const {setCartUpdatedNeeded} = displayCartSlice.actions;
export default displayCartSlice.reducer;
