import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const sendOtpApi = createAsyncThunk(
  'otp/sendOtp',
  async ({payload}: {payload: object}) => {
    const response = await request('POST', '/send_otp', payload);
    return response;
  },
);

export const checkOtpApi = createAsyncThunk(
  'otp/checkOtp',
  async ({payload}: {payload: object}) => {
    const response = await request('POST', '/check_otp', payload);
    return response;
  },
);
