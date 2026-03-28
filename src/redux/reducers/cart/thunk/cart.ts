import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const displayCart = createAsyncThunk(
  'Cart/display',
  async ({
    userId,
    sessionId,
    onlyOrder,
  }: {
    userId?: number;
    sessionId?: string;
    onlyOrder?: boolean;
  }) => {
    const params: {
      user_id?: number;
      session_id?: string;
      only_order?: boolean;
    } = {};
    if (userId !== undefined) {
      params.user_id = userId;
    }
    if (sessionId !== undefined) {
      params.session_id = sessionId;
    }
    if (onlyOrder !== undefined) {
      params.only_order = onlyOrder;
    }
    const response = await request('POST', `/api/cart/items`, params);
    return response;
  },
);
