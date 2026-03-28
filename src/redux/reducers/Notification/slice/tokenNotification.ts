import {createSlice} from '@reduxjs/toolkit';

const tokenNotification = createSlice({
  name: 'tokenNotification',
  initialState: {
    token: '',
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
  },
});

export const {setToken} = tokenNotification.actions;
export default tokenNotification.reducer;
