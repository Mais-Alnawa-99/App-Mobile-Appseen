import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getuserInvoices = createAsyncThunk(
  'user/invoices',
  async ({userId}: {userId: number}) => {
    const response = await request('POST', `/api/user/invoices`, {
      user_id: userId,
    });
    return response;
  },
);
