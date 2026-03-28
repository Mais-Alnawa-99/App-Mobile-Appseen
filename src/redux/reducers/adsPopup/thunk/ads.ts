import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const adsPopup = createAsyncThunk('Ads/Popup', async () => {
  const response = await request('POST', `/api/mobile/ads/popup`, {});
  return response;
});
