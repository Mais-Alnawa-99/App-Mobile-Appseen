import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../../network/api';

export const getdefaultUserLocations = createAsyncThunk(
  'user/defaultLocation',
  async ({userId, partnerId}: {userId: number; partnerId: string}) => {
    const response = await request('POST', `/api/user/address/set-default`, {
      user_id: userId,
      partner_id: partnerId,
    });
    return response;
  },
);
