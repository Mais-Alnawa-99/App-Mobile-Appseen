import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../../network/api';

export const getPaymentLink = createAsyncThunk(
    'Cart/getPaymentLink',
    async ({
        userId,
        orderId,
    }: {
        userId: number;
        orderId: number;
    }) => {
        const params: {
            user_id: number;
            order_id: number;
        } = { user_id: userId, order_id: orderId };
        const response = await request('POST', `/api/sale/create_payment_link`, params);
        return response;
    },
);