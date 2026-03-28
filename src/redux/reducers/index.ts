import { combineReducers } from '@reduxjs/toolkit';
import loader from './loader';
import auth from './User/startup';
import session from './User/session';
import lang from './User/lang';
import dimensions from './User/dimensions';
import server from './server';
import productDetails from './products/slice/detailsSlice';
import products from './products';
import modal from './modal';
import user from './User';
import homeData from './home/slice/homeSlice';
import productRatings from './ratings/slice/ratingsSlice';
import intro from './User/intro';
import translations from './translations';
import profile from './User/slice/profile';
import userCards from './User/slice/userCards';
import locations from './User/slice/locations';
import orders from './User/slice/orders';
import invoices from './User/slice/invoices';
import invoicePdf from './User/slice/invoicePdf';
import shop from './shop/slice/shop';
import suggestions from './search/slice/suggestions';
import add from './cart/slice/add';
import quantityCart from './cart/slice/quantityCart';
import quantity from './cart/slice/quantity';
import addLocation from './User/slice/locations/addLocation';
import setDefaultLocation from './User/slice/locations/setDefaultLocation';
import deleteLocation from './User/slice/locations/deleteLocation';
import getLocInfo from './User/slice/locations/getLocInfo';
import productByAttributes from './products/slice/productByAttributes';
import attributes from './shop/slice/attributes';
import attributeData from './shop/slice/attributeData';
import inventoryMsgs from './products/slice/inventoryMsgs';
import cart from './cart/slice/cart';
import deleteProd from './cart/slice/deleteProd';
import discount from './cart/slice/discount';
import updateLine from './cart/slice/updateLine';
import tokenNotification from './Notification/slice/tokenNotification';
import ads from './adsPopup/slice/ads';
import introSlice from './intro/slice/introSlice';
import wishlistCount from './wishlist/slice/wishlistCount';
import wishlist from './wishlist/slice/wishlist';
import quantityWishlist from './wishlist/slice/quantityWishlist';
import theme from './theme/slice/theme';
import order from './cart/slice/order';
import sellerProfile from './seller/slice/sellerProfile';
import news from './home/slice/news'
import HotDeals from './hotDeals/slice/hotDeals';
import ShippingAddress from './cart/slice/shippingAddress';
import checkOut from './cart/slice/checkOut';
import orderConfirmation from './cart/slice/OrderConfimation';
import searchReducer from './shop/slice/shop';
export default combineReducers({
  loader,
  auth,
  session,
  lang,
  dimensions,
  server,
  productDetails,
  modal,
  user,
  homeData,
  intro,
  products,
  translations,
  productRatings,
  profile,
  userCards,
  locations,
  orders,
  invoices,
  invoicePdf,
  shop,
  suggestions,
  add,
  quantityCart,
  quantity,
  addLocation,
  setDefaultLocation,
  deleteLocation,
  getLocInfo,
  productByAttributes,
  attributes,
  attributeData,
  inventoryMsgs,
  cart,
  deleteProd,
  discount,
  updateLine,
  tokenNotification,
  ads,
  introSlice,
  wishlistCount,
  wishlist,
  quantityWishlist,
  theme,
  order,
  sellerProfile,
  news,
  HotDeals,
  ShippingAddress,
  checkOut,
  orderConfirmation,
  search: searchReducer, 
});
