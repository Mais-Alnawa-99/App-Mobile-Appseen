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
import { useAppSelector } from '../redux/store';
import Locations from '../screens/auth/customer/Locations';
import DeleteAccount from '../screens/auth/customer/DeleteAccount';
import Orders from '../screens/auth/customer/Orders';
import Invoices from '../screens/auth/customer/Invoices';
import Shop from '../screens/search/Shop';
import AddEditLocation from '../screens/auth/customer/AddEditLocation';
import EditProfile from '../screens/auth/customer/EditProfile';
import GeustSettings from '../screens/auth/Geust';
import HotDeals from '../screens/hotDeals/HotDeals';
import Wishlist from '../screens/wishlist/Wishlist';
import SellerProfile from '../screens/sellerProfile/SellerProfile';

type RootStackParamList = {
  Home: any;
  WebViewScreen: any;
  BottomTabs: any;
  ProductDetails: any;
  Login: any;
  CustomerSignup: any;
  ProductRatings: any;
  Profile: any;
  Locations: any;
  DeleteAccount: any;
  Orders: any;
  Invoices: any;
  Shop: any;
  AddEditLocation: any;
  EditProfile: any;
  GeustSettings: any;
  HotDeals: any;
  Wishlist: any;
  SellerProfile: any;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();
const DashboardNavigator = () => {
  const { isLoggedIn } = useAppSelector(store => store.auth);
  return (
    <RootStack.Navigator
      initialRouteName={isLoggedIn ? 'Profile' : 'GeustSettings'}
    >
      {!isLoggedIn ? (
        <>
          <RootStack.Screen
            name="GeustSettings"
            component={GeustSettings}
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
            name="WebViewScreen"
            component={WebViewScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
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
            name="ProductRatings"
            component={ProductRatings}
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
            name="DeleteAccount"
            component={DeleteAccount}
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
            name="HotDeals"
            component={HotDeals}
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
        </>
      )}
    </RootStack.Navigator>
  );
};

export default DashboardNavigator;
