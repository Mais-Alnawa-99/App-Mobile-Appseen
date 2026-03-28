import {createSlice} from '@reduxjs/toolkit';
import {signupDataThunk} from '../thunk/signup';
import {boolean} from 'yup';

const initialState = {
  loading: false,
  countries: [],
  states: [],
  areas: [],
  isMap: false,
  emirateOnly: false,
};

const signupDataSlice = createSlice({
  name: 'signupData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(signupDataThunk.pending, (state, action) => {
      state.loading = true;
    }),
      builder.addCase(signupDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload?.result?.data?.countries;
        state.states = action.payload?.result?.data?.states;
        state.areas = action.payload?.result?.data?.areas;
        state.emirateOnly = action.payload?.result?.data?.emirate_code_only;
        state.isMap = action.payload?.result?.is_map;
      }),
      builder.addCase(signupDataThunk.rejected, (state, action) => {
        state.loading = false;
      }));
  },
});

export default signupDataSlice.reducer;
