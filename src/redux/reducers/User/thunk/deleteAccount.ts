import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const deleteAccountThunk = createAsyncThunk(
  'user/deleteAccount',
  async (payload: object) => {
    const response = await request('POST', '/api/delete_account', payload);
    return response;
  },
);
