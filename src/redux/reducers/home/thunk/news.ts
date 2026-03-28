import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../../network/api';

export const getNews = createAsyncThunk('home/getNews', async () => {
    const response = await request('POST', `/api/get_news_ticker`, {});
    return response;
});
