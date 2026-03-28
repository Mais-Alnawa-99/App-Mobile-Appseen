import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const getSuggestions = createAsyncThunk(
  'Home/getSuggestions',
  async ({suggestion}: {suggestion: string}) => {
    const response = await request('POST', `/api/search/suggestions`, {
      suggestion: suggestion,
    });
    return response;
  },
);
