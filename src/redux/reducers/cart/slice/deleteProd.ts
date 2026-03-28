import {createSlice} from '@reduxjs/toolkit';
import {deleteFromCart} from '../thunk/deleteProd';

interface dataType {
  success: boolean;
  deleteError: boolean;
  deleteLoader: boolean;
}

const initialState: dataType = {
  success: false,
  deleteError: false,
  deleteLoader: false,
};

const deleteFromCartSlice = createSlice({
  name: 'deleteFromCart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(deleteFromCart.pending, (state, action) => {
      state.deleteLoader = true;
    });
    builder.addCase(deleteFromCart.fulfilled, (state, action) => {
      state.deleteLoader = false;
      state.success = action?.payload?.result?.data?.success;
    });
    builder.addCase(deleteFromCart.rejected, (state, actoin) => {
      state.deleteError = true;
    });
  },
});

export default deleteFromCartSlice.reducer;
