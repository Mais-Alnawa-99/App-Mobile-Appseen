import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getProductRatings = createAsyncThunk(
  'product/getRatings',
  async ({
    userId,
    resId,
    limit,
    offset,
  }: {
    userId: number;
    resId: number;
    limit: number;
    offset: number;
  }) => {
    const response = await request('POST', `/api/product/comments/fetch`, {
      user_id: userId,
      res_id: resId,
      limit: limit,
      offset: offset,
    });
    return response;
  },
);
