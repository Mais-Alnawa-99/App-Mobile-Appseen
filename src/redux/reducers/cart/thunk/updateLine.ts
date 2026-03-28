import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const updateLinesInCart = createAsyncThunk(
  'Cart/update',
  async ({
    orderId,
    lineId,
    accessToken,
    remove,
    delet_,
  }: {
    orderId: number;
    lineId: number;
    accessToken: string;
    remove?: boolean;
    delet_?: boolean;
  }) => {
    const params: {
      order_id: number;
      line_id: number;
      access_token: string;
      remove?: boolean;
      delete?: boolean;
    } = {order_id: orderId, line_id: lineId, access_token: accessToken};
    if (remove !== undefined) {
      params.remove = remove;
    }
    if (delet_ !== undefined) {
      params.delete = delet_;
    }
    const response = await request(
      'POST',
      `/api/shop/cart/update_line`,
      params,
    );
    return response;
  },
);
