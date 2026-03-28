import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const setTokenApi = createAsyncThunk(
  'notification/setTokenApi',
  async (payload: any) => {
    const response = await request(
      'POST',
      '/api/notification/create/token',
      payload,
    );
    return response;
  },
);
