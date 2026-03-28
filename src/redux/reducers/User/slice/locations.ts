import {createSlice} from '@reduxjs/toolkit';
import {getuserLocations} from '../thunk/locations';

interface dataType {
  userLocations: any;
  userPartner: number;
  isMap: boolean;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  userLocations: {},
  userPartner: 0,
  isMap: false,
  dataLoader: true,
  error: false,
};

const userLocationsSlice = createSlice({
  name: 'userLocations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getuserLocations.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getuserLocations.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.userLocations = action.payload?.result?.data;
        state.isMap = action.payload?.result?.is_map;
        state.userPartner = action.payload?.result?.partner_user;
      }),
      builder.addCase(getuserLocations.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default userLocationsSlice.reducer;
