import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const signupDataThunk = createAsyncThunk(
  'user/signupData',
  async (payload: object) => {
    const response = await request('POST', '/api/user/signup/data', payload);
    return response;
  },
);

export const signupThunk = createAsyncThunk(
  'user/signup',
  async (payload: object) => {
    const response = await request(
      'POST',
      '/api/customer/signup/submit',
      payload,
    );
    return response;
  },
);

export const signupAppleThunk = createAsyncThunk(
  'user/signupApple',
  async (payload: object) => {
    const response = await request('POST', '/api/apple/signup/submit', payload);
    return response;
  },
);

export const cheackServiceAvailabilty = createAsyncThunk(
  'user/cheackServiceAvailabilty',
  async (payload: object) => {
    const response = await request(
      'POST',
      '/api/check_service_availability',
      payload,
    );
    return response;
  },
);
