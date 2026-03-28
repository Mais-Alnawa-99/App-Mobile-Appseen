import {createSlice} from '@reduxjs/toolkit';
import {getLocationInfo} from '../../thunk/locations/getLocInfo';

interface dataType {
  data: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  data: {},
  dataLoader: true,
  error: false,
};

const getLocationInfoSlice = createSlice({
  name: 'setDefaultLocation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getLocationInfo.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getLocationInfo.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.data = action.payload?.result?.data;
      }),
      builder.addCase(getLocationInfo.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default getLocationInfoSlice.reducer;
