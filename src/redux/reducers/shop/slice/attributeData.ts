import {createSlice} from '@reduxjs/toolkit';
import {getproductsAttributeData} from '../thunk/attributeData';

interface dataType {
  attributeData: any;
  attrDataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  attributeData: {},
  attrDataLoader: true,
  error: false,
};

const getProductsAattributeDataSlice = createSlice({
  name: 'ProductsAttributData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getproductsAttributeData.pending, (state, action) => {
      state.attrDataLoader = true;
    }),
      builder.addCase(getproductsAttributeData.fulfilled, (state, action) => {
        state.attrDataLoader = false;
        const {attrId} = action.meta.arg;
        state.attributeData[attrId] = action.payload?.result?.data;
      }),
      builder.addCase(getproductsAttributeData.rejected, (state, action) => {
        state.attrDataLoader = false;
        state.error = true;
      }));
  },
});

export default getProductsAattributeDataSlice.reducer;
