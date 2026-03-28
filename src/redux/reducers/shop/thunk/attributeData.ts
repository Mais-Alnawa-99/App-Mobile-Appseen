import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';
export const getproductsAttributeData = createAsyncThunk(
  'products/Attribute/data',
  async ({attrId}: {attrId: number}) => {
    const response = await request('POST', `/api/product/attribute/values`, {
      attr_id: attrId,
    });
    return response;
  },
);
