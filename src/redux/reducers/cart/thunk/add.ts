import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addToCart = createAsyncThunk(
  'Cart/add',
  async ({
    userId,
    sessionId,
    productId,
    qty,
    homePage,
    customVariants,
    additionalNotes,
  }: {
    userId?: number;
    sessionId?: string;
    productId: number;
    qty?: number;
    homePage?: boolean;
    customVariants: any;
    additionalNotes: string;
  }) => {
    const params: {
      user_id?: number;
      session_id?: string;
      product_id: number;
      add_qty?: number;
      home_page?: boolean;
      custom_variants?: any;
      additional_notes?: any;
    } = {
      product_id: productId,
    };
    if (userId !== undefined) {
      params.user_id = userId;
    }
    if (sessionId !== undefined) {
      params.session_id = sessionId;
    }
    if (qty !== undefined) {
      params.add_qty = qty;
    }
    if (homePage !== undefined) {
      params.home_page = homePage;
    }
    if (customVariants !== undefined) {
      params.custom_variants = customVariants;
    }
    if (additionalNotes !== undefined) {
      params.additional_notes = additionalNotes;
    }
    const response = await request('POST', `/api/shop/cart/add`, params);
    return response;
  },
);
