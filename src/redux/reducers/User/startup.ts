import {createSlice} from '@reduxjs/toolkit';
import {act} from 'react-test-renderer';

const auth = createSlice({
  name: 'auth',
  initialState: {
    token: false,
    refreshToken: false,
    isLoggedIn: false,
    authenticatedUser: null,
    userName: '',
  },
  reducers: {
    setAuthValues: (state, action) => {      
      if (action.payload?.token !== undefined) {
        state.token = action.payload.token;
        state.isLoggedIn = true; 
      }

      if (action.payload?.authenticatedUser !== undefined) {
        state.authenticatedUser = action.payload.authenticatedUser;
      }

      if (action.payload?.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }

      if (action.payload?.userName !== undefined) {
        state.userName = action.payload.userName;
      }
    },
    clearAuthValues: state => {
      state.token = false;
      state.isLoggedIn = false;
      state.authenticatedUser = null;
      state.refreshToken = false;
      state.userName = '';
    },
  },
});

export const {setAuthValues, clearAuthValues} = auth.actions;
export default auth.reducer;
