import {createAsyncThunk} from '@reduxjs/toolkit';
import {request} from '../../../network/api';

export const discountCode = createAsyncThunk(
  'Cart/discountCode',
  async ({promoCode, orderId}: {promoCode: string; orderId: string}) => {
    const params: {promo_code: string; order_id: string} = {
      promo_code: promoCode,
      order_id: orderId,
    };
    const response = await request('POST', `/api/shop/pricelist`, params);
    return response;
  },
);
