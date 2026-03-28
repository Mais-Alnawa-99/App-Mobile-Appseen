import { createSlice } from '@reduxjs/toolkit';
import { getCheckOut } from '../thunk/checkOut';
interface dataType {
    address: any;
    orderSummary: object;
    extraParams: object;
    countItems: number;
    orderItems: any;
    checkOutError: boolean;
    checkOutLoading: boolean;
}

const initialState: dataType = {
    address: [],
    orderSummary: {},
    extraParams: {},
    countItems: 0,
    orderItems: [],
    checkOutError: false,
    checkOutLoading: false,
};

const checkOut = createSlice({
    name: 'checkOut',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(getCheckOut.pending, (state, action) => {
            state.checkOutLoading = true;
        });
        builder.addCase(getCheckOut.fulfilled, (state, action) => {
            state.checkOutLoading = false;
            state.address = action?.payload?.result?.address_info;
            state.orderSummary = action?.payload?.result?.order_summary;
            state.extraParams = action?.payload?.result?.extra_params;
            state.countItems = action?.payload?.result?.count_items;
            state.orderItems = action?.payload?.result?.orderItems;
        });
        builder.addCase(getCheckOut.rejected, (state, action) => {
            state.checkOutLoading = false;
            state.checkOutError = true;
        });
    },
});

export default checkOut.reducer;
