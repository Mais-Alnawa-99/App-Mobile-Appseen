import {createSlice} from '@reduxjs/toolkit';
import {getaddUserLocations} from '../../thunk/locations/addLocation';

interface dataType {
  userAddLocations: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  userAddLocations: {},
  dataLoader: true,
  error: false,
};

const userLocationsSlice = createSlice({
  name: 'userAddLocations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getaddUserLocations.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getaddUserLocations.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.userAddLocations = action.payload?.result;
      }),
      builder.addCase(getaddUserLocations.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default userLocationsSlice.reducer;
