import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import { BW, BH } from '../../../style/theme';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { addToCart } from '../../../redux/reducers/cart/thunk/add';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { setModalData } from '../../../redux/reducers/modal';
import { setQuantityValues } from '../../../redux/reducers/cart/slice/quantity';
import { setCartUpdatedNeeded } from '../../../redux/reducers/cart/slice/cart';
import { getSessionId } from '../../../redux/reducers/User/thunk/login';
import { clearAuthValues } from '../../../redux/reducers/User/startup';
import {
  setSessionUserValues,
  setSessionValues,
} from '../../../redux/reducers/User/session';
import Loader from '../../../component/Loader';
import { withDecay } from 'react-native-reanimated';
import appsFlyer from 'react-native-appsflyer';
import { getValidToken } from '../../../redux/tokenService';

interface AddToCartBtnProps {
  prodId?: number;
  home?: boolean;
  bestContainer?: boolean;
}

function AddToCartBtn({
  prodId,
  home,
  bestContainer,
}: AddToCartBtnProps): JSX.Element {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { success, cartQuantity, msg, addToCartLoading, addToCartError } =
    useAppSelector(state => state.add);
  const [sessionId, setSessionId] = useState<any>();
  const { authenticatedUser, isLoggedIn } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const [buttonPressed, setButtonPressed] = useState(false);
  const quantityInCart = useAppSelector(state => state.quantity.quantityInCart);
  const [loading, setLoading] = useState(false);

  const _getSessionId = async () => {
    if (isLoggedIn) {
      if (!sessionUser) {
        dispatch(getSessionId({ is_logged_in: isLoggedIn })).then(res => {
          if (res.payload?.result && !!res.payload?.result?.session) {
            dispatch(
              setSessionUserValues({ session: res.payload?.result?.session }),
            );
          } else {
            dispatch(clearAuthValues());
          }
        });
      }
    } else {
      const token = await getValidToken();
      if (token) return token;
      else return null;
    }
  };

  useEffect(() => {
    _getSessionId();
  }, []);
  const handleAddToCart = () => {
    setButtonPressed(true);
    setLoading(true);
    if (authenticatedUser) {
      const cartData: any = {
        userId: authenticatedUser,
        productId: prodId ? parseInt(prodId) : prodId,
        homePage: home ? home : false,
      };
      if (sessionUser) {
        cartData.sessionId = sessionUser;
      }
      dispatch(addToCart(cartData)).then(res => {
        if (res.payload?.result?.type == 'calledSuccessfully') {
          setLoading(false);
          appsFlyer.logEvent(
            'add_to_cart',
            {
              product_id: prodId ? parseInt(prodId) : prodId,
              user_type: 'logged_in',
              user_id: authenticatedUser,
            },
            result => console.log('Appsflyer add_to_cart (logged_in):', result),
            error => console.error('Appsflyer add_to_cart error:', error),
          );
        }
      });
    } else if (!isLoggedIn && sessionPublic) {
      // _setModalData(t('loginPlease'));
      dispatch(
        addToCart({
          sessionId: sessionPublic?.toString(),
          productId: prodId ? parseInt(prodId) : prodId,
          homePage: home ? home : false,
        }),
      ).then(res => {
        if (res?.payload?.result?.data?.new_session) {
          dispatch(
            setSessionValues({
              session: res?.payload?.result?.data?.new_session,
            }),
          );
        }
        if (res.payload?.result?.type == 'calledSuccessfully') {
          setLoading(false);

          appsFlyer.logEvent(
            'add_to_cart',
            {
              product_id: prodId ? parseInt(prodId) : prodId,
              user_type: 'guest',
            },
            result => console.log('Appsflyer add_to_cart (guest):', result),
            error => console.error('Appsflyer add_to_cart error:', error),
          );
        }
      });
    } else {
      _setModalData(t('noUserOrSessionDataAvailable'));
    }
  };

  useEffect(() => {
    if (buttonPressed && success && !!cartQuantity) {
      dispatch(setQuantityValues({ quantityInCart: cartQuantity }));
      dispatch(setCartUpdatedNeeded(true));
    }
    if (buttonPressed && !success && msg == 'OutOfStock') {
      _setModalData(t('OutOfStock'), { minHeight: '20%' });
    }
  }, [cartQuantity, success]);

  const _setModalData = (msg: string, style?: any) => {
    dispatch(
      setModalData({
        modalVisible: true,
        message: msg,
        customStyle: style,
      }),
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.addToCart,
        bestContainer && {
          backgroundColor: '#ffffffb3',
          width: 28 * BW(),
          height: 28 * BW(),
          borderRadius: 4 * BW(),
        },
      ]}
      onPress={handleAddToCart}
    >
      {loading ? (
        <Loader
          style={{ backgroundColor: 'transparent', marginRight: 10 }}
          isLoading={loading}
          color={'#000'}
          size={26}
        />
      ) : (
        <Image
          source={require('../../../assets/bottomTab/cart.png')}
          style={{ width: 18 * BW(), height: 18 * BW() }}
        />
      )}
    </TouchableOpacity>
  );
}

export default AddToCartBtn;

const getStyle = (colors: any) =>
  StyleSheet.create({
    addToCart: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4 * BW(),
    },
  });
