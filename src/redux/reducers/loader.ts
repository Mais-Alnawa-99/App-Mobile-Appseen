import {createSlice} from '@reduxjs/toolkit';

const loaderStatusSlice = createSlice({
  name: 'loader',
  initialState: {
    loading: true,
  },
  reducers: {
    setLoaderStatus: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {setLoaderStatus} = loaderStatusSlice.actions;
export default loaderStatusSlice.reducer;
