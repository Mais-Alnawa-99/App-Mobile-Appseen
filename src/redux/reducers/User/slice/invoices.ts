import {createSlice} from '@reduxjs/toolkit';
import {getuserInvoices} from '../thunk/invoices';

interface dataType {
  userInvoices: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  userInvoices: {},
  dataLoader: true,
  error: false,
};

const userInvoicesSlice = createSlice({
  name: 'userInvoices',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getuserInvoices.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getuserInvoices.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.userInvoices = action.payload?.result?.data;
      }),
      builder.addCase(getuserInvoices.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default userInvoicesSlice.reducer;
