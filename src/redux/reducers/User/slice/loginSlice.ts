import {createSlice} from '@reduxjs/toolkit';
import {loginThunk} from '../thunk/login';

const initialState = {
  isLogging: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(loginThunk.pending, (state, action) => {
      state.isLogging = true;
    }),
      builder.addCase(loginThunk.fulfilled, (state, action) => {
        state.isLogging = false;
      }),
      builder.addCase(loginThunk.rejected, (state, action) => {
        state.isLogging = false;
      }));
  },
});

export default loginSlice.reducer;
