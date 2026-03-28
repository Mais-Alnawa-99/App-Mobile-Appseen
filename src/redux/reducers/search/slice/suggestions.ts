import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getSuggestions} from '../thunk/suggestions';

interface dataType {
  suggestions: any[];
  suggestionsError: boolean;
  suggestionsLoading: boolean;
}

const initialState: dataType = {
  suggestions: [],
  suggestionsError: false,
  suggestionsLoading: false,
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getSuggestions.pending, (state, action) => {
      state.suggestionsLoading = true;
      state.suggestionsError = false;
    }),
      builder.addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action?.payload?.result?.data;
      }),
      builder.addCase(getSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestionsError = true;
      }));
  },
});

// interface DataType {
//     suggestions: any[];
//     suggestionsError: boolean;
//     suggestionsLoading: boolean;
// }

// const initialState: DataType = {
//     suggestions: [],
//     suggestionsError: false,
//     suggestionsLoading: false,
// };

// const suggestionsSlice = createSlice({
//     name: 'suggestions',
//     initialState,
//     reducers: {},
//     extraReducers: builder => {
//         builder
//             .addCase(getSuggestions.pending, (state) => {
//                 state.suggestionsLoading = true;
//                 state.suggestionsError = false;
//             })
//             .addCase(getSuggestions.fulfilled, (state, action) => {
//                 state.suggestionsLoading = false;
//                 state.suggestions = action.payload;
//             })
//             .addCase(getSuggestions.rejected, (state, action) => {
//                 state.suggestionsLoading = false;
//                 state.suggestionsError = true;
//                 console.error('Error fetching suggestions:', action.payload);
//             });
//     },
// });

export default suggestionsSlice.reducer;
