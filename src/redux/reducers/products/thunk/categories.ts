import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getMainCategories = createAsyncThunk(
  'products/getMainCategories',
  async ({call_number, lang}: {call_number: number; lang: string}) => {
    const response = await request('POST', `/api/categories/main`, {
      lang: lang,
      page: call_number,
    });
    return response;
  },
);
