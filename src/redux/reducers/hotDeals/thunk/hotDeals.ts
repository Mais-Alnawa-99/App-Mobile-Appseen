import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../../network/api';

export const getHotDeals = createAsyncThunk(
    'getHotDeals',
    async ({ userId, sessionId }: { userId?: number; sessionId?: string }) => {
        const params: { user_id?: number; session_id?: string; limit: number } = { limit: 150 };
        if (userId !== undefined) {
            params.user_id = userId;
        }
        if (sessionId !== undefined) {
            params.session_id = sessionId;
        }
        const response = await request('POST', `/check/hot_deals`, params);
        return response;
    },
);
