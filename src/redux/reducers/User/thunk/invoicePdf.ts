import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getuserInvoicesPdf = createAsyncThunk(
  'user/invoices/pdf',
  async ({invoiceId}: {invoiceId: number}) => {
    const response = await request('POST', `/api/user/invoices/pdf`, {
      invoice_id: invoiceId,
    });
    return response;
  },
);
