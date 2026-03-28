import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../../network/api';

export const getShop = createAsyncThunk(
  'Home/getShop',
  async ({
    search,
    limit,
    offset,
    cat_id,
    filter_,
    attrValues,
    minPrice,
    order,
    product_pricelist_item_id,
    loyalty_program_id,
    with_child,
    discount,
  }: {
    search: string;
    limit: number;
    offset: number;
    cat_id?: number;
    filter_?: boolean;
    attrValues?: any;
    minPrice?: number;
    order?: string;
    product_pricelist_item_id?: number;
    loyalty_program_id?: number;
    with_child?: boolean;
    discount?: string;
  }) => {
    const params: {
      search: string;
      limit: number;
      offset: number;
      cat_id?: number;
      filter_?: boolean;
      attr_values?: any;
      min_price?: number;
      order?: string;
      product_pricelist_item_id?: number;
      loyalty_program_id?: number;
      with_child?: boolean;
      discount?: string;
    } = {
      search: search,
      limit: limit ?? 24,
      offset: offset,
    };
    if (cat_id !== undefined) {
      params.cat_id = cat_id;
    }
    if (filter_ !== undefined) {
      params.filter_ = filter_;
    }
    if (attrValues !== undefined) {
      params.attr_values = attrValues;
    }
    if (minPrice !== undefined) {
      params.min_price = minPrice;
    }
    if (order !== undefined) {
      params.order = order;
    }
    if (product_pricelist_item_id !== undefined) {
      params.product_pricelist_item_id = product_pricelist_item_id;
    }
    if (loyalty_program_id !== undefined) {
      params.loyalty_program_id = loyalty_program_id;
    }
    if (with_child !== undefined) {
      params.with_child = with_child;
    }
    if (discount !== undefined) {
      params.discount = discount;
    }
    const response = await request('POST', `/api/website/search/v2`, params);
    return response;
  },
);
