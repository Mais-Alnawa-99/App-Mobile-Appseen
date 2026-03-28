import {createSlice} from '@reduxjs/toolkit';
import {getTranslationJson} from './translationThunk';

const initialState = {
  ar: {},
  en: {},
  ru: {},
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setTranslates: (state, action) => {
      state.ar = action.payload?.ar;
      state.en = action.payload?.en;
      state.ru = action.payload?.ru;
    },
  },
});
export const {setTranslates} = translationSlice.actions;
export default translationSlice.reducer;
