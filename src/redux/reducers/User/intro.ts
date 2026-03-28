import {createSlice} from '@reduxjs/toolkit';

const intro = createSlice({
  name: 'intro',
  initialState: {
    skipedIntro: false,
  },
  reducers: {
    setSkipedIntro: state => {
      state.skipedIntro = true;
    },
    clearSkipedIntro: state => {
      state.skipedIntro = false;
    },
  },
});

export const {setSkipedIntro, clearSkipedIntro} = intro.actions;
export default intro.reducer;
