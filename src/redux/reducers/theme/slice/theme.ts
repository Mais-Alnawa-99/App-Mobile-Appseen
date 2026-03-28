import {createSlice} from '@reduxjs/toolkit';
import {getTheme} from '../thunk/theme';

interface dataType {
  themeData: any;
  themeError: boolean;
  themeLoading: boolean;
}

const initialState: dataType = {
  themeData: {},
  themeError: false,
  themeLoading: false,
};

const themeSlice = createSlice({
  name: 'themeSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getTheme.pending, (state, action) => {
      state.themeLoading = true;
      state.themeError = false;
    }),
      builder.addCase(getTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        state.themeData = action?.payload?.result?.data;
      }),
      builder.addCase(getTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.themeError = true;
      }));
  },
});

export default themeSlice.reducer;
