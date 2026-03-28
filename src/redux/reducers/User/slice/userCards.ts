import {createSlice} from '@reduxjs/toolkit';
import {getuserCards} from '../thunk/userCards';

interface dataType {
  userCards: any;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  userCards: [],
  dataLoader: true,
  error: false,
};

const userCardsSlice = createSlice({
  name: 'userCards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getuserCards.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getuserCards.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.userCards = action.payload?.result?.data;
      }),
      builder.addCase(getuserCards.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default userCardsSlice.reducer;
