import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getProductDetails = createAsyncThunk(
  'product/getDetails',
  async (payload: object) => {
    const response = await request('POST', `/api/product/page/data`, payload);
    return response;
  },
);

export const getProductsByAttributes = createAsyncThunk(
  'product/getProductsByAttributes',
  async (payload: object) => {
    const response = await request(
      'POST',
      `/api/products_by_attributes`,
      payload,
    );
    
    return response;
  },
);
