import {createSlice} from '@reduxjs/toolkit';
import {getprofileData} from '../thunk/profile';

interface dataType {
  profileData: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  profileData: {},
  dataLoader: true,
  error: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getprofileData.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getprofileData.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.profileData = action.payload?.result?.data;
      }),
      builder.addCase(getprofileData.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default profileSlice.reducer;
