import { createSlice } from '@reduxjs/toolkit';
import { getOrderConfirmation } from '../thunk/OrderConfimation';
interface dataType {
    data: object;
    orderSummary: object;
    extraParams: object;
    checkOutError: boolean;
    checkOutLoading: boolean;
}

const initialState: dataType = {
    data: {},
    orderSummary: {},
    extraParams: {},
    checkOutError: false,
    checkOutLoading: false,
};

const orderConfirmation = createSlice({
    name: 'orderConfirmation',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(getOrderConfirmation.pending, (state, action) => {
            state.checkOutLoading = true;
        });
        builder.addCase(getOrderConfirmation.fulfilled, (state, action) => {
            state.checkOutLoading = false;
            state.data = action?.payload?.result?.data;
            state.orderSummary = action?.payload?.result?.data?.order_summary;
            state.extraParams = action?.payload?.result?.data?.extra_params;
        });
        builder.addCase(getOrderConfirmation.rejected, (state, action) => {
            state.checkOutLoading = false;
            state.checkOutError = true;
        });
    },
});

export default orderConfirmation.reducer;
