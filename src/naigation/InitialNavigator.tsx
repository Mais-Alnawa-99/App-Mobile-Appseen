import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WebViewScreen from '../screens/WebViewScreen';
import Home from '../screens/home/Home';
import { navigationRef } from './NavigationService';
import BottomTabs from './tabs/BottomTab';
import ProductDetails from '../screens/products/ProductDetails';
import Login from '../screens/auth/Login';
import CustomerSignup from '../screens/auth/customer/Signup';
import ProductRatings from '../screens/products/ratings/ProductRatings';
import Profile from '../screens/auth/customer/Profile';
import AllProducts from '../screens/products/AllProducts';
import SearchScreen from '../screens/search/Search';
import Locations from '../screens/auth/customer/Locations';
import Orders from '../screens/auth/customer/Orders';
import Invoices from '../screens/auth/customer/Invoices';
import Shop from '../screens/search/Shop';
import AddEditLocation from '../screens/auth/customer/AddEditLocation';
import EditProfile from '../screens/auth/customer/EditProfile';
import Cart from '../screens/cart/Cart';
import Wishlist from '../screens/wishlist/Wishlist';
import SellerProfile from '../screens/sellerProfile/SellerProfile';
import HotDeals from '../screens/hotDeals/HotDeals';
import GeustInfo from '../screens/cart/GeustInfo';
import CheckOut from '../screens/cart/CheckOut';

type RootStackParamList = {
  Home: any;
  WebViewScreen: any;
  BottomTabs: any;
  ProductDetails: any;
  Login: any;
  CustomerSignup: any;
  AllProducts: any;
  ProductRatings: any;
  Profile: any;
  Locations: any;
  SearchScreen: any;
  Orders: any;
  Invoices: any;
  Shop: any;
  AddEditLocation: any;
  EditProfile: any;
  Cart: any;
  Wishlist: any;
  SellerProfile: any;
  HotDeals: any;
  GeustInfo: any;
  CheckOut: any;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();
const InitialNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Home">
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
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CustomerSignup"
        component={CustomerSignup}
        options={{ headerShown: false }}
      />

      <RootStack.Screen
        name="AllProducts"
        component={AllProducts}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ProductRatings"
        component={ProductRatings}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Locations"
        component={Locations}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Orders"
        component={Orders}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Invoices"
        component={Invoices}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Shop"
        component={Shop}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AddEditLocation"
        component={AddEditLocation}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SellerProfile"
        component={SellerProfile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="HotDeals"
        component={HotDeals}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="GeustInfo"
        component={GeustInfo}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CheckOut"
        component={CheckOut}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default InitialNavigator;
