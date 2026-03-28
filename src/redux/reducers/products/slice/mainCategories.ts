import {createSlice} from '@reduxjs/toolkit';
import {getMainCategories} from '../thunk/categories';

interface dataType {
  mainCategories: any[];
  mainDataLoader: boolean;
  limitMainData: number;
  offsetMainData: number;
  error: boolean;
  moredataMainLoading: boolean;
  totalMainPages: number;
}

const initialState: dataType = {
  mainCategories: [],
  limitMainData: 1,
  offsetMainData: 1,
  mainDataLoader: true,
  error: false,
  moredataMainLoading: false,
  totalMainPages: 1,
};

const MainCategoriesSlice = createSlice({
  name: 'mainCategories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getMainCategories.pending, (state, action) => {
      if (action.meta.arg.call_number == 1) {
        state.mainDataLoader = true;
        state.offsetMainData = 1;
        state.totalMainPages = 1;
      } else {
        state.moredataMainLoading = true;
      }
    }),
      builder.addCase(getMainCategories.fulfilled, (state, action) => {
        state.mainDataLoader = false;
        state.moredataMainLoading = false;
        state.offsetMainData = state.offsetMainData + 1;
        state.totalMainPages = action.payload?.result?.total_pages;

        if (action.meta.arg.call_number == 1) {
          state.mainCategories = [];
        }
        if (action.payload?.result && action.payload?.result?.length != 0) {
          state.mainCategories = [
            ...state.mainCategories,
            ...action.payload?.result?.data,
          ];
        }
      }),
      builder.addCase(getMainCategories.rejected, (state, action) => {
        state.mainDataLoader = false;
        state.error = true;
        state.moredataMainLoading = false;
      }));
  },
});

export default MainCategoriesSlice.reducer;
