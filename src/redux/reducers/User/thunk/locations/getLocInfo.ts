import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../../network/api';

export const getLocationInfo = createAsyncThunk(
  'user/locationInfo',
  async ({
    userId,
    partnerId,
    mobile,
  }: {
    userId: number;
    partnerId: string;
    mobile: true;
  }) => {
    const response = await request('POST', `/api/get/address-info`, {
      user_id: userId,
      partner_id: partnerId,
      mobile: mobile,
    });
    return response;
  },
);
export const getShippingAddress = createAsyncThunk(
  'user/getShippingAddress',
  async ({
    userId,
  }: {
    userId: number;
  }) => {
    const response = await request('POST', `/api/shipping_address`, {
      user_id: userId,
    });
    return response;
  },
);
