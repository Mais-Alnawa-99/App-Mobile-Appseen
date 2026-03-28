import {createSlice} from '@reduxjs/toolkit';
import {getuserOrders} from '../thunk/orders';

interface dataType {
  userOrders: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  userOrders: {},
  dataLoader: true,
  error: false,
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getuserOrders.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getuserOrders.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.userOrders = action.payload?.result?.data;
      }),
      builder.addCase(getuserOrders.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default userOrdersSlice.reducer;
