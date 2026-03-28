import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';
export const getproductsAttributes = createAsyncThunk(
  'products/Attributes',
  async (payload: object) => {
    const response = await request('POST', `/api/product/attributes`, payload);
    return response;
  },
);
