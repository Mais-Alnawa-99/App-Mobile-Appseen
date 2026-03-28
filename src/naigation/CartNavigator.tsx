import React, { useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WebViewScreen from '../screens/WebViewScreen';
import ProductDetails from '../screens/products/ProductDetails';
import ProductRatings from '../screens/products/ratings/ProductRatings';
import { useAppSelector } from '../redux/store';
import CategoriesScreen from '../screens/categories/Categories';
import Login from '../screens/auth/Login';
import { getBaseURL } from '../redux/network/api';
import Profile from '../screens/auth/customer/Profile';
import { useAppDispatch } from '../redux/store';
import { quantityItemsInCart } from '../redux/reducers/cart/thunk/quantityCart';
import { setQuantityValues } from '../redux/reducers/cart/slice/quantity';
import Cart from '../screens/cart/Cart';
import ShippingAddress from '../screens/cart/ShippingAddress';
import CheckOut from '../screens/cart/CheckOut';
import Wishlist from '../screens/wishlist/Wishlist';
import GeustInfo from '../screens/cart/GeustInfo';
import OrderConfirmation from '../screens/cart/OrderConfirmation';
import Home from '../screens/home/Home';
import SellerProfile from '../screens/sellerProfile/SellerProfile';

type RootStackParamList = {
  Categories: any;
  WebViewScreen: any;
  BottomTabs: any;
  ProductDetails: any;
  Login: any;
  CustomerSignup: any;
  ProductRatings: any;
  Profile: any;
  Locations: any;
  DeleteAccount: any;
  Cart: any;
  Wishlist: any;
  ShippingAddress: any;
  CheckOut: any;
  GeustInfo: any;
  OrderConfirmation: any;
  SellerProfile: any;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();
const CartNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName={'Cart'}>
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ProductRatings"
        component={ProductRatings}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ShippingAddress"
        component={ShippingAddress}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CheckOut"
        component={CheckOut}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="GeustInfo"
        component={GeustInfo}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SellerProfile"
        component={SellerProfile}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default CartNavigator;
