import {createSlice} from '@reduxjs/toolkit';
import {deleteUserLocations} from '../../thunk/locations/deleteLocation';

interface dataType {
  deleteSuccessfuly: boolean;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  deleteSuccessfuly: false,
  dataLoader: true,
  error: false,
};

const deleteUserLocationsSlice = createSlice({
  name: 'deleteUserLocations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(deleteUserLocations.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(deleteUserLocations.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.deleteSuccessfuly = action.payload?.result?.success;
      }),
      builder.addCase(deleteUserLocations.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default deleteUserLocationsSlice.reducer;
