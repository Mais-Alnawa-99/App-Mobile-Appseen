import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../../network/api';

export const deleteUserLocations = createAsyncThunk(
  'user/deleteLocation',
  async ({userId, partnerId}: {userId: number; partnerId: string}) => {
    const response = await request('POST', `/api/user/location/archive`, {
      user_id: userId,
      partner_id: partnerId,
    });
    return response;
  },
);
