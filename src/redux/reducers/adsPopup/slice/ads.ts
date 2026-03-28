import {createSlice} from '@reduxjs/toolkit';
import {adsPopup} from '../thunk/ads';

interface dataType {
  adsData: any;
  adsError: boolean;
  adsLoading: boolean;
}

const initialState: dataType = {
  adsData: {},
  adsError: false,
  adsLoading: false,
};

const adsPopupSlice = createSlice({
  name: 'adsPopup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(adsPopup.pending, (state, action) => {
      state.adsLoading = true;
      state.adsError = false;
    }),
      builder.addCase(adsPopup.fulfilled, (state, action) => {
        state.adsLoading = false;
        state.adsData = action?.payload?.result?.data;
      }),
      builder.addCase(adsPopup.rejected, (state, action) => {
        state.adsLoading = false;
        state.adsError = true;
      }));
  },
});
export default adsPopupSlice.reducer;
