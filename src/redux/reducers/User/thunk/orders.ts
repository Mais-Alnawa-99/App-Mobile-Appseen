import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getuserOrders = createAsyncThunk(
  'user/locations',
  async ({userId}: {userId: number}) => {
    const response = await request('POST', `/api/user/orders`, {
      user_id: userId,
    });
    return response;
  },
);
