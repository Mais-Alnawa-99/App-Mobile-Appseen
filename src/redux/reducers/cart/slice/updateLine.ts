import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {updateLinesInCart} from '../thunk/updateLine';

interface dataType {
  successUpdate: boolean;
  cartQuantityUpdate: number;
  quantityError: boolean;
  quantityLoading: boolean;
}

const initialState: dataType = {
  successUpdate: false,
  cartQuantityUpdate: 0,
  quantityError: false,
  quantityLoading: false,
};

const updateLinesInCartSlice = createSlice({
  name: 'updateLines',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(updateLinesInCart.pending, (state, action) => {
      state.quantityLoading = true;
      state.quantityError = false;
    }),
      builder.addCase(updateLinesInCart.fulfilled, (state, action) => {
        state.quantityLoading = false;
        state.successUpdate = action?.payload?.result?.data?.success;
        state.cartQuantityUpdate =
          action?.payload?.result?.data?.cart_quantity || 0;
      }),
      builder.addCase(updateLinesInCart.rejected, (state, action) => {
        state.quantityLoading = false;
        state.quantityError = true;
      }));
  },
});
export default updateLinesInCartSlice.reducer;
