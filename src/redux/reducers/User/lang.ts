import {createSlice} from '@reduxjs/toolkit';

const lang = createSlice({
  name: 'lang',
  initialState: {
    lang: 'en',
    selectedLang: false,
  },
  reducers: {
    setLangValue: (state, action) => {
      state.lang = action.payload;
      state.selectedLang = true;
    },
    clearLangValue: state => {
      state.lang = 'en';
      state.selectedLang = false;
    },
  },
});

export const {setLangValue, clearLangValue} = lang.actions;
export default lang.reducer;
