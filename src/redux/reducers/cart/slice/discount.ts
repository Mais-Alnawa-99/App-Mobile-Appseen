import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {discountCode} from '../thunk/discountCode';

interface dataType {
  success: null;
  msg: string;
  type: string;
  discountCodeError: boolean;
  discountCodeLoading: boolean;
}

const initialState: dataType = {
  success: null,
  msg: '',
  type: '',
  discountCodeError: false,
  discountCodeLoading: false,
};

const discountCodeSlice = createSlice({
  name: 'discountCode',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(discountCode.pending, (state, action) => {
      state.discountCodeLoading = true;
      state.discountCodeError = false;
    }),
      builder.addCase(discountCode.fulfilled, (state, action) => {
        state.discountCodeLoading = false;
        state.success = action?.payload?.result?.data?.successPromo;
        state.msg = action?.payload?.result?.msg || '';
        state.type = action?.payload?.result?.type || '';
      }),
      builder.addCase(discountCode.rejected, (state, action) => {
        state.discountCodeLoading = false;
        state.discountCodeError = true;
      }));
  },
});
export default discountCodeSlice.reducer;
