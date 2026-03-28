import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getIntro = createAsyncThunk('get/Intro', async () => {
  const response = await request('POST', `/api/mobile/intro`, {});
  return response;
});
