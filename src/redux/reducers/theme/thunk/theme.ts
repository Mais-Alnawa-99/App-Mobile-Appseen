import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getTheme = createAsyncThunk('getTheme', async () => {
  const response = await request('POST', `/api/seen/theme`, {});
  return response;
});
