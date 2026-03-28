import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getSellerProfile = createAsyncThunk(
  'getSellerProfile',
  async ({partnerId}: {partnerId: string}) => {
    const params: {partner_id: string} = {
      partner_id: partnerId,
    };
    const response = await request('POST', `/api/seller/profile`, params);
    return response;
  },
);
