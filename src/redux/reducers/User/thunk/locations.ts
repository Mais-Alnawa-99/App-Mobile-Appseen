import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getuserLocations = createAsyncThunk(
  'user/locations',
  async ({userId}: {userId: number}) => {
    const response = await request('POST', `/api/user/location`, {
      user_id: userId,
    });
    return response;
  },
);
