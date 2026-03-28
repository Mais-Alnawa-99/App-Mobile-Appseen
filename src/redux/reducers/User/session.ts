import {createSlice} from '@reduxjs/toolkit';
// import session from 'redux-persist/lib/storage/session';

const session = createSlice({
  name: 'session',
  initialState: {
    sessionPublic: false,
    sessionUser: null,
    expiresIn: null,
  },
  reducers: {
    setSessionValues: (state, action) => {
      state.sessionPublic = action.payload?.session;
      state.expiresIn = action.payload?.expiresIn;
    },
    clearSessionValues: state => {
      state.sessionPublic = false;
    },
    setSessionUserValues: (state, action) => {
      state.sessionUser = action?.payload?.session;
    },
    clearSessionUserValues: state => {
      state.sessionUser = null;
    },
  },
});

export const {
  setSessionValues,
  clearSessionValues,
  setSessionUserValues,
  clearSessionUserValues,
} = session.actions;
export default session.reducer;
