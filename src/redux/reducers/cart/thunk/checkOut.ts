import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../../network/api';

export const getCheckOut = createAsyncThunk(
    'Cart/getCheckOut',
    async (
        payload:
            | { userId: number; orderId: number }
            | {
                mobile: string;
                country_id: number;
                state_id: number;
                area_id: number;
                street: string;
                more_info: string;
                shipping_latitude: number;
                shipping_longitude: number;
                shipping_address: string;
                orderId: number;
            },
    ) => {
        let params: any;

        if ("userId" in payload) {
            params = { user_id: payload.userId, order_id: payload.orderId };
        } else {
            params = { ...payload, order_id: payload.orderId };
        }

        const response = await request("POST", `/api/shop/checkout`, params);
        return response;
    }
);
