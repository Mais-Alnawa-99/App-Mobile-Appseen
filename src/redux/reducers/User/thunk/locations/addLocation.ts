import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../../network/api';

export const getaddUserLocations = createAsyncThunk(
  'user/addLocations',
  async ({
    formMode,
    mobile,
    data,
    partnerId,
  }: {
    formMode?: string;
    mobile: boolean;
    data: object;
    partnerId: string;
  }) => {
    const response = await request('POST', `/api/submit/address`, {
      form_mode: formMode,
      mobile: mobile,
      data: data,
      partner_id: partnerId,
    });
    return response;
  },
);
