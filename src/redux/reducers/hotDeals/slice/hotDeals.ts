import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getHotDeals } from '../thunk/hotDeals';

interface dataType {
    data: any;
    hotError: boolean;
    hotLoading: boolean;
}

const initialState: dataType = {
    data: [],
    hotError: false,
    hotLoading: false,
};

const hotDealsSlice = createSlice({
    name: 'hotDealsSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        (builder.addCase(getHotDeals.pending, (state, action) => {
            state.hotLoading = true;
            state.hotError = false;
        }),
            builder.addCase(getHotDeals.fulfilled, (state, action) => {
                state.hotLoading = false;
                state.data = action?.payload?.result?.data
            }),
            builder.addCase(getHotDeals.rejected, (state, action) => {
                state.hotLoading = false;
                state.hotError = true;
            }));
    },
});
export default hotDealsSlice.reducer;
