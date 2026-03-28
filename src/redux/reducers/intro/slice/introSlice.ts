import {createSlice} from '@reduxjs/toolkit';
import {getIntro} from '../thunk/intro';

interface dataType {
  introData: Record<string, any>;
  introError: boolean;
  introLoading: boolean;
  // skipped: boolean;
}

const initialState: dataType = {
  introData: {},
  introError: false,
  introLoading: false,
  // skipped: false,
};

const introSlice = createSlice({
  name: 'intro',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIntro.pending, (state) => {
      state.introLoading = true;
      state.introError = false;
    });
    builder.addCase(getIntro.fulfilled, (state, action) => {
      state.introLoading = false;
      state.introData = action?.payload?.result?.data || {};
      // state.skipped = action?.payload?.result?.skipped || false;
    });
    builder.addCase(getIntro.rejected, (state) => {
      state.introLoading = false;
      state.introError = true;
    });
  },
});

export default introSlice.reducer;
