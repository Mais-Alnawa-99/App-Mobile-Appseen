import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../network/api';

export const getVersion = createAsyncThunk(
  'getVersion',
  async (payload: object) => {
    const response = await request('POST', `/check/app/version`, payload);
    return response;
  },
);
