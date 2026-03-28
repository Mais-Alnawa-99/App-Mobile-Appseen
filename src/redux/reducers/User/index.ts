import {combineReducers} from '@reduxjs/toolkit';
import login from './slice/loginSlice';
import signUp from './slice/signUp';

export default combineReducers({
  login,
  signUp,
});
