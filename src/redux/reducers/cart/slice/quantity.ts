import {createSlice} from '@reduxjs/toolkit';

const quantity = createSlice({
  name: 'quantity',
  initialState: {
    quantityInCart: 0,
  },
  reducers: {
    setQuantityValues: (state, action) => {
      state.quantityInCart = action.payload && action.payload?.quantityInCart;
    },
    clearQuantityValues: state => {
      state.quantityInCart;
    },
  },
});

export const {setQuantityValues, clearQuantityValues} = quantity.actions;
export default quantity.reducer;
