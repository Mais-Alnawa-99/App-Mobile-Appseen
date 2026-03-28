import {createSlice} from '@reduxjs/toolkit';
import {editProfileThunk} from '../thunk/editProfile';

const initialState = {
  loading: false,
  status: '',
};

const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(editProfileThunk.pending, (state, action) => {
      state.loading = true;
    }),
      builder.addCase(editProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload?.result?.status;
      }),
      builder.addCase(editProfileThunk.rejected, (state, action) => {
        state.loading = false;
      }));
  },
});

export default editProfileSlice.reducer;
