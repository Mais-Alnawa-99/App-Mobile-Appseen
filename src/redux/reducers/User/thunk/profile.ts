import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getprofileData = createAsyncThunk(
  'user/profile',
  async ({userId}: {userId: number}) => {
    const response = await request('POST', `/api/user/profile/data`, {
      user_id: userId,
    });
    return response;
  },
);
