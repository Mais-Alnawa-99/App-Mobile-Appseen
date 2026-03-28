import {createAsyncThunk} from '@reduxjs/toolkit';
import {buildBody, request} from '../../../network/api';
import reactotron from '../../../reactotron';

export const getData = createAsyncThunk(
  'data/getData',
  async (
    {
      firstLoad,
      call_number,
      lang,
      user_id,
    }: {
      firstLoad: boolean;
      call_number: string;
      lang: string;
      user_id: any;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await request('POST', `/api/v2/homepage/data`, {
        call_number,
        lang,
        user_id,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
