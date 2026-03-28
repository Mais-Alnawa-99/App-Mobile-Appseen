import {createSlice} from '@reduxjs/toolkit';
import {getInventoryMsgs} from '../thunk/inventoryMsgs';

interface dataType {
  msg: string;
  outOfStock: boolean;
  msgLoader: boolean;
  msgErrore: boolean;
}

const initialState: dataType = {
  msg: '',
  outOfStock: false,
  msgLoader: false,
  msgErrore: false,
};

const inventoryMsgsSlice = createSlice({
  name: 'inventoryMsgs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getInventoryMsgs.pending, state => {
      state.msgLoader = true;
    }),
      builder.addCase(getInventoryMsgs.fulfilled, (state, action) => {
        state.msgLoader = false;
        state.msg = action?.payload?.result?.msg;
        state.outOfStock = action?.payload?.result?.data?.outOfStock;
      }),
      builder.addCase(getInventoryMsgs.rejected, state => {
        state.msgLoader = false;
        state.msgErrore = true;
      }));
  },
});

export default inventoryMsgsSlice.reducer;
