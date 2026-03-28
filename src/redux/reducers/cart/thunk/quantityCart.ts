import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const quantityItemsInCart = createAsyncThunk(
  'Cart/quantity',
  async ({userId, sessionId}: {userId?: number; sessionId?: string}) => {
    const params: {user_id?: number; session_id?: string} = {};
    if (userId !== undefined) {
      params.user_id = userId;
    }
    if (sessionId !== undefined) {
      params.session_id = sessionId;
    }
    const response = await request('POST', `/api/shop/cart/quantity`, params);
    return response;
  },
);
