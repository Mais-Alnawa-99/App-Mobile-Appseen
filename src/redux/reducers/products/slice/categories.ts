// import {createSlice} from '@reduxjs/toolkit';
// import {getCategories} from '../thunk/categories';

// interface dataType {
//   categories: any[];
//   dataLoader: boolean;
//   limitData: number;
//   offsetData: number;
//   error: boolean;
//   moredataLoading: boolean;
//   totalPages: number;
// }

// const initialState: dataType = {
//   categories: [],
//   limitData: 1,
//   offsetData: 1,
//   dataLoader: true,
//   error: false,
//   moredataLoading: false,
//   totalPages: 1,
// };

// const CategoriesSlice = createSlice({
//   name: 'categories',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     (builder.addCase(getCategories.pending, (state, action) => {
//       if (action.meta.arg.call_number == 1) {
//         state.dataLoader = true;
//         state.offsetData = 1;
//         state.totalPages = 1;
//       } else {
//         state.moredataLoading = true;
//       }
//     }),
//       builder.addCase(getCategories.fulfilled, (state, action) => {
//         state.dataLoader = false;
//         state.moredataLoading = false;
//         state.offsetData = state.offsetData + 1;
//         state.totalPages = action.payload?.result?.total_pages;

//         if (action.meta.arg.call_number == 1) {
//           state.categories = [];
//         }
//         if (
//           action.meta.arg.call_number == 1 &&
//           action.payload?.result?.length == 0
//         ) {
//           state.totalPages = 1;
//         }
//         if (action.payload?.result && action.payload?.result?.length != 0) {
//           state.categories = [
//             ...state.categories,
//             ...action.payload?.result?.data,
//           ];
//         }
//       }),
//       builder.addCase(getCategories.rejected, (state, action) => {
//         state.dataLoader = false;
//         state.error = true;
//         state.moredataLoading = false;
//       }));
//   },
// });

// export default CategoriesSlice.reducer;
