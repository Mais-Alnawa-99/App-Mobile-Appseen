import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (payload: object) => {
    const response = await request('POST', `/api/shop/wishlist/add`, payload);
    return response;
  },
);

export const deleteFromWishlist = createAsyncThunk(
  'wishlist/deleteFromWishlist',
  async (payload: object) => {
    const response = await request(
      'POST',
      `/api/shop/wishlist/unlink`,
      payload,
    );
    return response;
  },
);
