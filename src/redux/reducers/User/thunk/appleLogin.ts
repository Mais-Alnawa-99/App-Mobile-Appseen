import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const appleLogin = createAsyncThunk(
  'user/appleLogin',
  async (payload: object) => {
    const response = await request('POST', '/api/login/apple_id', payload);
    return response;
  },
);
