import {createSlice} from '@reduxjs/toolkit';
import {getuserInvoicesPdf} from '../thunk/invoicePdf';

interface dataType {
  userInvoice: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  userInvoice: {},
  dataLoader: true,
  error: false,
};

const userInvoicesPdfSlice = createSlice({
  name: 'userInvoicesPdf',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getuserInvoicesPdf.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getuserInvoicesPdf.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.userInvoice = action.payload?.result?.data;
      }),
      builder.addCase(getuserInvoicesPdf.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default userInvoicesPdfSlice.reducer;
