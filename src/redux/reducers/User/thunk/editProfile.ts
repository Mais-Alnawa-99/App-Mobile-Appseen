import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const editProfileThunk = createAsyncThunk(
  'user/editProfile',
  async (payload: object) => {
    const response = await request('POST', '/api/user/profile/edit', payload);
    return response;
  },
);
