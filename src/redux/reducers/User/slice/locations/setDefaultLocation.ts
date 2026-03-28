import {createSlice} from '@reduxjs/toolkit';
import {getdefaultUserLocations} from '../../thunk/locations/setDefaultLocation';

interface dataType {
  setSuccessfuly: boolean;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  setSuccessfuly: false,
  dataLoader: true,
  error: false,
};

const setDefaultLocationsSlice = createSlice({
  name: 'setDefaultLocation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getdefaultUserLocations.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getdefaultUserLocations.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.setSuccessfuly = action.payload?.result?.data?.success;
      }),
      builder.addCase(getdefaultUserLocations.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default setDefaultLocationsSlice.reducer;
