import {createSlice} from '@reduxjs/toolkit';
import {getData} from '../thunk/homethunk';

interface dataType {
  data: any[];
  dataLoader: boolean;
  limitData: number;
  offsetData: number;
  error: boolean;
  moredataLoading: boolean;
}
let firstLoading = true;

const initialState: dataType = {
  data: [],
  limitData: 10,
  offsetData: 0,
  dataLoader: true,
  error: false,
  moredataLoading: false,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getData.pending, (state, action) => {
      if (action.meta.arg.firstLoad) {
        state.dataLoader = true;
      } else {
        state.moredataLoading = true;
      }
    }),
      builder.addCase(getData.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.moredataLoading = false;
        state.offsetData = action.payload?.offset;
        if (action.meta.arg.firstLoad) {
          state.data = [];
        }
        if (action.payload?.data && action.payload?.data.length != 0) {
          state.data = action.payload?.data;
        }
      }),
      builder.addCase(getData.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
        state.moredataLoading = false;
      }));
  },
});

export default dataSlice.reducer;
