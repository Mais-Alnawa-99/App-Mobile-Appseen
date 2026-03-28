import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getShop} from '../thunk/shop';

interface dataType {
  searchResult: any[];
  childCategs: any[];
  count: number;
  limit: number;
  offset: number;
  searchError: boolean;
  searchLoading: boolean;
}

const initialState: dataType = {
  searchResult: [],
  childCategs: [],
  count: 0,
  limit: 10,
  offset: 0,
  searchError: false,
  searchLoading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getShop.pending, (state) => {
        state.searchLoading = true;
        state.searchError = false;
        state.childCategs = [];
      })
      .addCase(getShop.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResult = action?.payload?.result?.data;
        state.childCategs = action?.payload?.result?.child_categs;
        state.count = action?.payload?.result?.count || 0;
      })
      .addCase(getShop.rejected, (state) => {
        state.searchLoading = false;
        state.searchError = true;
      });
  },
});

export const { setOffset } = searchSlice.actions;
export default searchSlice.reducer;
