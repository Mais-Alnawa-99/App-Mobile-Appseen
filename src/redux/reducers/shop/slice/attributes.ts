import {createSlice} from '@reduxjs/toolkit';
import {getproductsAttributes} from '../thunk/attributes';

interface dataType {
  data: any;
  minPrice: number;
  maxPrice: number;
  dataLoader: boolean;
  error: boolean;
}

const initialState: dataType = {
  data: null,
  minPrice: 0,
  maxPrice: 0,
  dataLoader: true,
  error: false,
};

const getProductsAattributesSlice = createSlice({
  name: 'ProductsAttributs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    (builder.addCase(getproductsAttributes.pending, (state, action) => {
      state.dataLoader = true;
    }),
      builder.addCase(getproductsAttributes.fulfilled, (state, action) => {
        state.dataLoader = false;
        state.data = action.payload?.result?.data?.attrs;
        state.minPrice = action.payload?.result?.data?.min_price;
        state.maxPrice = action.payload?.result?.data?.max_price;
      }),
      builder.addCase(getproductsAttributes.rejected, (state, action) => {
        state.dataLoader = false;
        state.error = true;
      }));
  },
});

export default getProductsAattributesSlice.reducer;
