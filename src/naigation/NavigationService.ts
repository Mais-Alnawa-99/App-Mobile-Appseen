import * as React from 'react';
import { StackActions } from '@react-navigation/routers';
import {
  DrawerActions,
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import reactotron from '../redux/reactotron';

export const navigationRef = createNavigationContainerRef<any>();
export const isReadyRef = React.createRef<null>();

function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

function replace(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.current &&
      navigationRef.current.dispatch(StackActions.replace(name, params));
  }
}

function openDrawer() {
  navigationRef.isReady() &&
    navigationRef.current &&
    navigationRef.current.dispatch(DrawerActions.openDrawer());
}

function closeDrawer() {
  navigationRef.current &&
    navigationRef.current.dispatch(DrawerActions.closeDrawer());
}
function reset(routeName: string, params?: any) {
  navigationRef.current &&
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      }),
    );
}

function push(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.current?.dispatch(StackActions.push(name, params));
  }
}

export default {
  navigate,
  goBack,
  replace,
  openDrawer,
  closeDrawer,
  reset,
  push
};
