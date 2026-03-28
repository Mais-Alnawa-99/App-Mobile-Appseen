import {combineReducers} from '@reduxjs/toolkit';
import categories from './slice/categories';
import mainCategories from './slice/mainCategories';

export default combineReducers({
  categories,
  mainCategories,
});
