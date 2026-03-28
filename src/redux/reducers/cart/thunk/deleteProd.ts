import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const deleteFromCart = createAsyncThunk(
  'cart/deleteProduct',
  async ({
    userId,
    sessionId,
    orderLine,
  }: {
    userId?: number;
    sessionId?: string;
    orderLine: number;
  }) => {
    const params: {
      user_id?: number;
      session_id?: string;
      order_line_id: number;
    } = {order_line_id: orderLine};
    if (userId !== undefined) {
      params.user_id = userId;
    }
    if (sessionId !== undefined) {
      params.session_id = sessionId;
    }
    const response = await request('POST', `/api/shop/cart/clear`, params);
    return response;
  },
);
