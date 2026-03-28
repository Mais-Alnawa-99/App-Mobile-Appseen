import {createSlice} from '@reduxjs/toolkit';
import {getProductsByAttributes} from '../thunk/detailsThunk';

const initialState = {
  prodByAttrId: null,
  prodByAttr: {},
  loadingDetails: true,
};

const productByAttributes = createSlice({
  name: 'productByAttributes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getProductsByAttributes.pending, (state, action) => {
      state.loadingDetails = true;
    }),
      builder.addCase(getProductsByAttributes.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.prodByAttr = action.payload?.result;
        state.prodByAttrId = action.payload?.result?.id;
      }),
      builder.addCase(getProductsByAttributes.rejected, (state, action) => {
        state.loadingDetails = false;
      }));
  },
});

export default productByAttributes.reducer;
