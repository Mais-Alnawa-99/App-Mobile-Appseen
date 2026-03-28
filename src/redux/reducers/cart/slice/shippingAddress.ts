import { createSlice } from '@reduxjs/toolkit';
import { getShippingAddress } from '../thunk/shippingAddress';

interface dataType {
    address: any;
    personalInfo: object;
    orderSummary: object;
    extraParams: object;
    addressError: boolean;
    addressLoading: boolean;
}

const initialState: dataType = {
    address: [],
    personalInfo: {},
    orderSummary: {},
    extraParams: {},
    addressError: false,
    addressLoading: false,
};

const shippingAddresses = createSlice({
    name: 'shippingAddresses',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(getShippingAddress.pending, (state, action) => {
            state.addressLoading = true;
        });
        builder.addCase(getShippingAddress.fulfilled, (state, action) => {
            state.addressLoading = false;
            state.address = action?.payload?.result?.data?.addresses;
            state.personalInfo = action?.payload?.result?.data?.personal_info;
            state.orderSummary = action?.payload?.result?.data?.order_summary;
            state.extraParams = action?.payload?.result?.data?.extra_params;
        });
        builder.addCase(getShippingAddress.rejected, (state, action) => {
            state.addressLoading = false;
            state.addressError = true;
        });
    },
});

export default shippingAddresses.reducer;
