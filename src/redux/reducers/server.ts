import {createSlice} from '@reduxjs/toolkit';

const serverStatusSlice = createSlice({
  name: 'serverStatus',
  initialState: {
    isOnline: true,
  },
  reducers: {
    setServerStatus: (state, action) => {
      state.isOnline = action.payload;
    },
  },
});

export const {setServerStatus} = serverStatusSlice.actions;
export default serverStatusSlice.reducer;
