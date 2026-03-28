import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WebViewScreen from '../screens/WebViewScreen';
import ProductDetails from '../screens/products/ProductDetails';
import ProductRatings from '../screens/products/ratings/ProductRatings';
import { useAppSelector } from '../redux/store';
import CategoriesScreen from '../screens/categories/Categories';
import Login from '../screens/auth/Login';
import Profile from '../screens/auth/customer/Profile';
import SearchScreen from '../screens/search/Search';
import Shop from '../screens/search/Shop';
import Wishlist from '../screens/wishlist/Wishlist';
import HotDeals from '../screens/hotDeals/HotDeals';
import SellerProfile from '../screens/sellerProfile/SellerProfile';
import Invoices from '../screens/auth/customer/Invoices';
type RootStackParamList = {
  HotDeals: any;
  WebViewScreen: any;
  BottomTabs: any;
  ProductDetails: any;
  Login: any;
  CustomerSignup: any;
  ProductRatings: any;
  Profile: any;
  Locations: any;
  DeleteAccount: any;
  SearchScreen: any;
  Shop: any;
  SellerProfile: any;
  Invoices: any;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();
const HotDealsNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName={'HotDeals'}>
      <RootStack.Screen
        name="HotDeals"
        component={HotDeals}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SellerProfile"
        component={SellerProfile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Invoices"
        component={Invoices}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
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
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Shop"
        component={Shop}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default HotDealsNavigator;
