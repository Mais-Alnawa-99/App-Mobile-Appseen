import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getInventoryMsgs = createAsyncThunk(
  'products/getInventoryMsgs',
  async ({productId}: {productId: number}) => {
    const response = await request('POST', `/api/product_inventory`, {
      product_id: productId,
    });
    return response;
  },
);
