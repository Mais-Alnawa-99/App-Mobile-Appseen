import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const quantityItemsInWishlist = createAsyncThunk(
  'Wishlist/quantity',
  async ({userId, sessionId}: {userId?: number; sessionId?: string}) => {
    const params: {user_id?: number; session_id?: string} = {};
    if (userId !== undefined) {
      params.user_id = userId;
    }
    if (sessionId !== undefined) {
      params.session_id = sessionId;
    }
    const response = await request('POST', `/api/shop/wishlist/count`, params);
    return response;
  },
);
