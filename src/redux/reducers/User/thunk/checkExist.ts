import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const checkExistThunk = createAsyncThunk(
  'user/checkExist',
  async ({payload}: {payload: object}) => {
    const response = await request('POST', '/api/user/check-exist', payload);
    return response;
  },
);
