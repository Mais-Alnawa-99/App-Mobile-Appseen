import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const addNominee = createAsyncThunk(
  'Cart/addNominee',
  async ({orderId}: {orderId: string}) => {
    const params: {order_id: string} = {
      order_id: orderId,
    };
    const response = await request('POST', `/api/add_nominee`, params);
    return response;
  },
);
