import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getuserCards = createAsyncThunk(
  'user/cards',
  async ({userId}: {userId: number}) => {
    const response = await request('POST', `/api/user/cards`, {
      user_id: userId,
    });
    return response;
  },
);
