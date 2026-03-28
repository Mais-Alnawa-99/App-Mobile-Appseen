import {createSlice} from '@reduxjs/toolkit';

const order = createSlice({
  name: 'order',
  initialState: {
    orderId: '',
  },
  reducers: {
    setOrderValue: (state, action) => {
      state.orderId = action.payload?.order;
    },
    clearOrderValue: state => {
      state.orderId = '';
    },
  },
});

export const {setOrderValue, clearOrderValue} = order.actions;
export default order.reducer;
