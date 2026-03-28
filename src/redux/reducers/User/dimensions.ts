import {createSlice} from '@reduxjs/toolkit';
import {Dimensions} from 'react-native';

const dimensions = createSlice({
  name: 'dimensions',
  initialState: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    isLandscape: false,
  },
  reducers: {
    setDimensions: (state, action) => {
      state.width = action.payload?.width;
      state.height = action.payload?.height;
      if (action.payload?.width < action.payload?.height) {
        state.isLandscape = false;
      } else {
        state.isLandscape = true;
      }
    },
  },
});

export const {setDimensions} = dimensions.actions;
export default dimensions.reducer;
