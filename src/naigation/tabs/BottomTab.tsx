import React, { useEffect, useState } from 'react';
import theme, { BW, BH } from '../../style/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
//Screens
import Home from '../../screens/home/Home';
import InitialNavigator from '../InitialNavigator';
import DashboardNavigator from '../DashboardNavigator';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Categories from '../../screens/categories/Categories';
import Profile from '../../screens/auth/customer/Profile';
import WebViewScreen from '../../screens/WebViewScreen';
import { getBaseURL } from '../../redux/network/api';
import CategoriesNavigator from '../CategoriesNavigator';
import CartNavigator from '../CartNavigator';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { setQuantityValues } from '../../redux/reducers/cart/slice/quantity';
import { quantityItemsInCart } from '../../redux/reducers/cart/thunk/quantityCart';
import { setCartUpdatedNeeded } from '../../redux/reducers/cart/slice/cart';
import HotDeals from '../../screens/hotDeals/HotDeals';
import HotDealsNavigator from '../HotDealsNavigation';
import { StackActions } from '@react-navigation/routers';
const Tab = createBottomTabNavigator();

export const _getQuantityCart = (
  dispatch,
  isLoggedIn,
  authenticatedUser,
  sessionUser,
  sessionPublic,
) => {
  if (isLoggedIn && authenticatedUser) {
    dispatch(
      quantityItemsInCart({
        userId: authenticatedUser,
        sessionId: sessionUser,
      }),
    ).then(res => {
      if (res.payload?.result && !!res.payload?.result?.data?.success) {
        dispatch(
          setQuantityValues({
            quantityInCart: res.payload?.result?.data?.cart_quantity,
          }),
        );
        dispatch(setCartUpdatedNeeded(false));
      }
    });
  } else if (!!sessionPublic) {
    dispatch(quantityItemsInCart({ sessionId: sessionPublic })).then(res => {
      if (res.payload?.result && res.payload?.result?.data?.success) {
        dispatch(
          setQuantityValues({
            quantityInCart: res.payload?.result?.data?.cart_quantity,
          }),
        );
      }
    });
  }
};

function BottomTabs() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const cartQuantity = useAppSelector(state => state.add.cartQuantity);
  const quantityInCart = useAppSelector(state => state.quantity.quantityInCart);
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const { cartUpdateNeeded } = useAppSelector(state => state.cart);
  useEffect(() => {
    _getQuantityCart(
      dispatch,
      isLoggedIn,
      authenticatedUser,
      sessionUser,
      sessionPublic,
    );
  }, [cartQuantity, isLoggedIn, cartUpdateNeeded]);

  useEffect(() => {
    let intervalId: number | null = null;

    if (authenticatedUser && isLoggedIn) {
      intervalId = setInterval(() => {
        _getQuantityCart(dispatch, isLoggedIn, authenticatedUser);
      }, 5000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [authenticatedUser, isLoggedIn]);

  return (
    <Tab.Navigator
      screenListeners={({ navigation, route }) => ({
        tabPress: e => {
          const state = navigation.getState();
          const tabState = state.routes.find(r => r.key === route.key)?.state;

          if (tabState && tabState.type === 'stack' && tabState.index > 0) {
            e.preventDefault();

            navigation.navigate(route.name);

            navigation.dispatch({
              ...StackActions.popToTop(),
              target: tabState.key,
            });
          }
        },
      })}
      initialRouteName={'initialRoute'}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 22 * BW();
          // color = focused ? '#CE9C56' : '#C4C4C4';
          let rn = route.name;
          let tabIcon;
          if (rn === 'initialRoute') {
            tabIcon = require('../../assets/bottomTab/home.png');
          } else if (rn === 'CategoriesNavigator') {
            tabIcon = require('../../assets/bottomTab/menu.png');
          } else if (rn === 'Hot') {
            tabIcon = require('../../assets/icons/hot.png');
          } else if (rn === 'MyCart') {
            tabIcon = require('../../assets/bottomTab/cart.png');
          } else if (rn === 'Me') {
            tabIcon = require('../../assets/bottomTab/profile.png');
          }
          return (
            <Image
              source={tabIcon}
              resizeMode="contain"
              style={{
                height: 20 * BW(),
                width: 20 * BW(),
                resizeMode: 'contain',
                tintColor:
                  rn === 'Hot'
                    ? focused
                      ? '#E85454'
                      : '#E85454'
                    : focused
                    ? colors.activeBottomTabs
                    : '#292D32',
              }}
            />
          );
        },
        tabBarActiveTintColor:
          route.name === 'Hot' ? '#E85454' : colors.activeBottomTabs,
        tabBarInactiveTintColor:
          route.name === 'Hot' ? '#E85454' : colors.textGray,
        tabBarLabelStyle: {
          paddingBottom: 10 * BW(),
          fontSize: theme.themeObject.currentFontSize.h4,
          fontFamily: theme.themeObject.currentFontFamily.normal,
          color: route.name === 'Hot' ? '#E85454' : colors.textGray,
        },
        tabBarStyle: {
          padding: 10 * BW(),
          minHeight: Platform.OS == 'android' ? 70 * BH() : 100 * BH(),
          backgroundColor: colors.background,
        },
        // unmountOnBlur: true,
      })}
    >
      <Tab.Screen
        name={'initialRoute'}
        component={InitialNavigator}
        options={{
          headerShown: false,
          title: t('home'),
        }}
      />

      <Tab.Screen
        name={'CategoriesNavigator'}
        component={CategoriesNavigator}
        options={{
          headerShown: false,
          title: t('Category'),
        }}
      />
      <Tab.Screen
        name={'Hot'}
        component={HotDealsNavigator}
        options={{
          headerShown: false,
          title: t('hotDeals'),
        }}
      />
      <Tab.Screen
        name={'MyCart'}
        options={{
          headerShown: false,
          title: t('MyCart'),
          tabBarBadge: quantityInCart,
          unmountOnBlur: true,
          tabBarBadgeStyle: {
            backgroundColor: colors.badgeBottomTabs,
            color: '#fff',
          },
        }}
        component={CartNavigator}
      />
      <Tab.Screen
        name={'Me'}
        component={DashboardNavigator}
        options={{
          headerShown: false,
          title: t('Me'),
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomTabs;
