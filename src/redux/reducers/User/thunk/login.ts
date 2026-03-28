import {createAsyncThunk, prepareAutoBatched} from '@reduxjs/toolkit';
import {request} from '../../../network/api';
import reactotron from 'reactotron-react-native';

export const loginThunk = createAsyncThunk(
  'user/login',
  async ({payload}: {payload: object}) => {
    const response = await request('POST', '/api/user/login', payload);
    return response;
  },
);

export const getSessionId = createAsyncThunk(
  'user/getSessionId',
  async (payload: object) => {
    const response = await request('POST', '/api/get_session_id', payload);
    return response;
  },
);

export const getSessionPublicId = createAsyncThunk(
  'user/getSessionPublicId',
  async (payload: object) => {
    reactotron.log('getSessionPublicId thunk called with payload:', payload);
    const response = await request(
      'POST',
      '/api/get_session_public_id',
      payload,
    );
    return response;
  },
);
