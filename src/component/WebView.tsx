import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  BackHandler,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';

import theme, {BW} from '../style/theme';
import {useFocusEffect} from '@react-navigation/native';
import Header from './Header';
import NavigationService from '../naigation/NavigationService';
import {getBaseURL, URL} from '../redux/network/api';
import {useAppDispatch, useAppSelector} from '../redux/store';
import reactotron from '../redux/reactotron';
import {_getQuantityCart} from '../naigation/tabs/BottomTab';
import {quantityItemsInCart} from '../redux/reducers/cart/thunk/quantityCart';
import {setQuantityValues} from '../redux/reducers/cart/slice/quantity';
import {setModalData} from '../redux/reducers/modal';
import {useTranslation} from 'react-i18next';
import {displayCart} from '../redux/reducers/cart/thunk/cart';
import {setOrderValue} from '../redux/reducers/cart/slice/order';
import {addNominee} from '../redux/reducers/cart/thunk/draw';

type SectionProps = PropsWithChildren<{
  url: string;
  sessionId: any;
  hideBack?: boolean;
  hideCart?: boolean;
  onNavigationStateChange: (navState: {
    url: string;
    canGoBack: boolean;
  }) => void;
  withoutSession?: boolean;
}>;

const WebViewCustom = React.forwardRef(
  (
    {
      url,
      sessionId,
      hideBack,
      hideCart,
      onNavigationStateChange,
      withoutSession,
    }: SectionProps,
    ref,
  ): JSX.Element => {
    const webViewRef = useRef<WebView>(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(url);
    const [key, setKey] = useState(1);
    const [isWebViewUrlChanged, setIsWebViewUrlChanged] = useState(false);
    const [title, setTitle] = useState('');
    const quantityInCart = useAppSelector(
      state => state.quantity.quantityInCart,
    );
    const {cartQuantity} = useAppSelector(state => state.quantityCart);
    const {sessionPublic, sessionUser} = useAppSelector(state => state.session);
    const {isLoggedIn, authenticatedUser} = useAppSelector(state => state.auth);
    const {orderId} = useAppSelector(state => state.order);
    const {t} = useTranslation();
    useImperativeHandle(ref, () => ({
      goBack: () => {
        if (webViewRef.current) {
          webViewRef.current.goBack();
        }
      },
    }));

    const resetWebViewToInitialUrl = useCallback(() => {
      if (isWebViewUrlChanged) {
        setKey(prevKey => prevKey + 1);
        setIsWebViewUrlChanged(false);
      }
    }, [isWebViewUrlChanged]);

    useFocusEffect(() => {
      setCurrentUrl(url);
    });

    const handleBackButtonPress = () => {
      try {
        if (canGoBack) {
          webViewRef.current?.goBack();
        } else {
          NavigationService.goBack();
        }
      } catch (err) {}
    };

    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonPress,
        );
      };
    }, [canGoBack]);

    const styles = getStyle();

    const extractIdFromUrl = (url: string): string | null => {
      const regex = /\/(\d+)#/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const handleNavigationStateChange = (navState: {
      url: string;
      canGoBack: boolean;
    }) => {
      const {url, canGoBack} = navState;
      setCanGoBack(canGoBack);
      if (url !== currentUrl) {
        setIsWebViewUrlChanged(true);
      }
      if (url.endsWith('/shop')) {
        webViewRef.current?.goBack();
        NavigationService.navigate('Shop');
      }
      // const match = url.match(/\/shop\/[^?#]+-(\d+)(?:[?#].*)?$/);
      // if (match) {
      //   const productId = match[1];
      //   const item = {id: productId};
      //   webViewRef.current?.goBack();
      //   NavigationService.navigate('ProductDetails', {item: item});
      // }

      // if (url.endsWith('/shop/cart')) {
      //   setCurrentUrl(BaseURL + '/shop/payment');
      // }
      if (url.endsWith('/') || url.endsWith('/ar') || url.endsWith('/home')) {
        webViewRef.current?.goBack();
        NavigationService.navigate('Home');
      }
      if (url.endsWith('/me') || url.endsWith('/profile')) {
        webViewRef.current?.goBack();
        NavigationService.navigate('Me');
      }
      if (url.includes('/login')) {
        webViewRef.current?.goBack();
        NavigationService.navigate('Login');
      }
      if (url.includes('/signup')) {
        webViewRef.current?.goBack();
        NavigationService.navigate('Signup');
      }
      if (url.includes('/payment')) {
        webViewRef.current?.goBack();
        NavigationService.navigate('OrderConfirmation');
      }
      // if (url.includes('/shop/confirmation')) {
      //   if (!!orderId) {
      //     dispatch(addNominee({orderId})).then(res => {
      //       if (res?.payload?.result?.success) {
      //         _setModalData(res?.payload?.result?.message);
      //       }
      //     });
      //   }
      // }
      // if (url.includes('shop/category')) {
      //   const parts = url.split('/');
      //   const categoryId = parts[parts.length - 1];
      //   NavigationService.navigate('Shop', {
      //     cat_id: categoryId,
      //   });
      // }

      onNavigationStateChange(navState);
    };
    const _setModalData = (msg: string) => {
      dispatch(
        setModalData({
          modalVisible: true,
          title: t('congrats'),
          message: msg,
          titleConfirm: t('continueShopping'),
          fun: () => {
            NavigationService.navigate('Shop', {});
          },
        }),
      );
    };

    let code = `
    let meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); document.getElementsByTagName('head')[0].appendChild(meta);
    document.getElementById('bottom').style.display = 'none'; document.getElementById('top').style.display = 'none';
    document.getElementById('vertical-icons').style.display = 'none';
    let elements = document.getElementsByClassName('products_header');
    if (elements.length > 0) {
        elements[0].style.display = 'none';
    };
    
    let breadcrumb = document.getElementsByClassName('seen_breadcrumb');
    if (breadcrumb.length > 0) {
      breadcrumb[0].remove()
    };
    let o_frontend_to_backend_buttons = document.getElementsByClassName('o_frontend_to_backend_buttons');
    if (o_frontend_to_backend_buttons.length > 0) {
      o_frontend_to_backend_buttons[0].remove()
    };
    let o_frontend_to_backend_nav = document.getElementsByClassName('o_frontend_to_backend_nav');
    if (o_frontend_to_backend_nav.length > 0) {
      o_frontend_to_backend_nav[0].remove()
    };

    let add_to_cart_wrap = document.getElementById('add_to_cart_wrap');
    if(add_to_cart_wrap){
      add_to_cart_wrap.addEventListener('click', function(event) {
        event.preventDefault();
        window.ReactNativeWebView.postMessage('add_to_cart_wrap');
      });
    }
      
    let add_to_cart_ = document.querySelectorAll('#add_to_cart');
       if (add_to_cart_.length > 0) {
        add_to_cart_.forEach((item) => {
          item.addEventListener('click', function (event) {
           event.preventDefault();
           window.ReactNativeWebView.postMessage('add_to_cart_');
        });
      });
    }

    let updateCard = document.querySelectorAll('.js_delete_product');
    if (updateCard.length > 0) {
      updateCard.forEach((item) => {
        item.addEventListener('click', function (event) {
          event.preventDefault();
          window.ReactNativeWebView.postMessage('js_delete_clicked');
        });
      });
    }
      
  `;

    // ${
    //   Platform.OS == 'android'
    //     ? ` const checkoutButton1 = document.querySelector(".Checkout_btn");

    //      // Check if the button exists and click it directly
    //      if (checkoutButton1) {
    //          checkoutButton1.click();
    //      }`
    //     : `window.onload = function() {
    //      // Find the checkout button by class name
    //      const checkoutButton = document.querySelector(".Checkout_btn");

    //      // Check if the button exists and click it directly
    //      if (checkoutButton) {
    //          checkoutButton.click();
    //      }
    //  };`
    // }

    const handleShouldStartLoadWithRequest = (request: any) => {
      if (request?.title) {
        setTitle(request.title);
      }
      return true;
    };

    const dispatch = useAppDispatch();
    const onMessage = e => {
      _getQuantityCart(dispatch, isLoggedIn, authenticatedUser);
    };
    return (
      <>
        <Header
          hideDrawer
          hideNotification
          onPress={() => handleBackButtonPress()}
          title={title}
          titleCenter
          hideTitle
          titleCenterStyle={{flex: 4}}
          showCart={!hideCart}
          hideBack={hideBack && !canGoBack}
        />

        <ScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.appContainer}>
            <WebView
              key={key}
              ref={webViewRef}
              injectedJavaScript={code}
              onMessage={event => {
                onMessage(event);
              }}
              onNavigationStateChange={handleNavigationStateChange}
              renderLoading={() => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}>
                  <ActivityIndicator
                    style={{alignSelf: 'center'}}
                    size={30}
                    color="#000"
                  />
                </View>
              )}
              source={{
                uri: currentUrl,
                headers: {
                  Cookie: withoutSession ? 'Public' : `session_id=${sessionId}`,
                },
              }}
              style={{flex: 1, width: '100%', height: '100%'}}
              startInLoadingState={true}
              scalesPageToFit={false}
              allowUniversalAccessFromFileURLs={true}
              javaScriptEnabled={true}
              setSupportMultipleWindows={false}
              javaScriptCanOpenWindowsAutomatically={true}
              domStorageEnabled={true}
              allowFileAccess={true}
              mediaPlaybackRequiresUserAction={true}
              allowsFullscreenVideo={false}
              allowsInlineMediaPlayback={true}
              bounce={false}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            />
          </View>
        </ScrollView>
      </>
    );
  },
);

const getStyle = () =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: '#fff',
      minHeight: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
  });

export default WebViewCustom;
