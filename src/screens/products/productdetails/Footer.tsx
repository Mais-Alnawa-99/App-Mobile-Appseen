import React, {useEffect, useState} from 'react';
import Text from '../../../component/Text';
import {useTheme} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BH, BW} from '../../../style/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {
  addToWishlist,
  deleteFromWishlist,
} from '../../../redux/reducers/wishlist/thunk/add_delete';
import {addToCart} from '../../../redux/reducers/cart/thunk/add';
import {setQuantityValues} from '../../../redux/reducers/cart/slice/quantity';
import {setModalData} from '../../../redux/reducers/modal';
import NavigationService from '../../../naigation/NavigationService';
import Loader from '../../../component/Loader';
import {setQuantityWishlist} from '../../../redux/reducers/wishlist/slice/quantityWishlist';
import {getProductsByAttributes} from '../../../redux/reducers/products/thunk/detailsThunk';
import {getBaseURL} from '../../../redux/network/api';
import Counter from './Counter';
import appsFlyer from 'react-native-appsflyer';

function Footer(props: any): JSX.Element {
  const {
    data,
    qty,
    areCustomInputsValid,
    additionalNotes,
    inputValues,
    setInputEmpty,
    isOutOfStock,
    selectedVariantDetails,
    productTmplId,
    count,
    increaseCount,
    decreaseCount,
  } = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const [isInWishlist, setIsInWishlist] = useState(data?.is_in_wishlist);
  const [wishId, setWishId] = useState(data.wish_id);
  const {isLoggedIn, authenticatedUser} = useAppSelector(state => state.auth);
  const [buttonPressed, setButtonPressed] = useState(false);
  // const [orderId, setOrderId] = useState(0);
  const [loader, setLoader] = useState(false);
  const {success, cartQuantity, msg, addToCartLoading, addToCartError} =
    useAppSelector(state => state.add);
  const {prodByAttrId, loadingDetails} = useAppSelector(
    state => state.productByAttributes,
  );
  const {sessionPublic, sessionUser} = useAppSelector(state => state.session);

  const dispatch = useAppDispatch();

  const handleAddToCart = (buyNow = false) => {
    setButtonPressed(true);
    if (!areCustomInputsValid()) {
      setInputEmpty(true);
      // _setModalData(
      //   t('Please fill all required custom inputs before adding to the cart.'),
      // );
      return;
    }
    if (!buyNow) {
      setLoader(true);
    }

    if (authenticatedUser) {
      dispatch(
        addToCart({
          userId: authenticatedUser,
          productId: prodByAttrId ? parseInt(prodByAttrId) : prodByAttrId,
          qty: qty,
          sessionId: sessionUser ? sessionUser : '',
          customVariants: areCustomInputsValid() ? inputValues : {},
          additionalNotes: areCustomInputsValid() ? additionalNotes : '',
        }),
      ).then(res => {
        if (res?.payload?.result && res?.payload?.result?.data) {
          setLoader(false);
          appsFlyer.logEvent(
            'add_to_cart',
            {
              product_id: prodByAttrId ? parseInt(prodByAttrId) : prodByAttrId,
              user_type: 'logged_in',
              user_id: authenticatedUser,
            },
            result => console.log('Appsflyer add_to_cart (logged_in):', result),
            error => console.error('Appsflyer add_to_cart error:', error),
          );
          dispatch(
            getProductsByAttributes({
              product_template_id: productTmplId,
              attribute_ids: selectedVariantDetails,
            }),
          );
          if (buyNow) {
            navigationBuyNow(res?.payload?.result?.data?.order_id);
          }
        }
      });
    } else if (!isLoggedIn) {
      // _setModalData(t('loginPlease'));
      dispatch(
        addToCart({
          sessionId: sessionPublic?.toString(),
          productId: prodByAttrId ? parseInt(prodByAttrId) : prodByAttrId,
          qty: qty,
          customVariants: areCustomInputsValid() ? inputValues : {},
          additionalNotes: areCustomInputsValid() ? additionalNotes : '',
        }),
      ).then(res => {
        if (res?.payload?.result && res?.payload?.result?.data) {
          if (res?.payload?.result?.type == 'calledSuccessfully') {
            setLoader(false);
            appsFlyer.logEvent(
              'add_to_cart',
              {
                product_id: prodByAttrId
                  ? parseInt(prodByAttrId)
                  : prodByAttrId,
                user_type: 'guest',
              },
              result => console.log('Appsflyer add_to_cart (guest):', result),
              error => console.error('Appsflyer add_to_cart error:', error),
            );
            dispatch(
              getProductsByAttributes({
                product_template_id: productTmplId,
                attribute_ids: selectedVariantDetails,
              }),
            );
            if (buyNow) {
              navigationBuyNow(res?.payload?.result?.data?.order_id);
            }
          }
        }
      });
    } else {
      _setModalData(t('noUserOrSessionDataAvailable'));
    }
  };

  const handleBuyNow = async () => {
    if (!areCustomInputsValid()) {
      setInputEmpty(true);
      return;
    }
    let buyNow = true;
    await handleAddToCart(buyNow);
  };
  const navigationBuyNow = (orderId: number) => {
    if (authenticatedUser) {
      NavigationService.navigate('CheckOut', {
        orderId: orderId,
      });
    } else if (!isLoggedIn) {
      NavigationService.navigate('GeustInfo', {
        orderId: orderId,
      });
    }

    // NavigationService.navigate('WebViewScreen', {
    //   url: `${getBaseURL()}/shop/checkout`,
    // });
  };
  useEffect(() => {
    if (buttonPressed && success && !!cartQuantity) {
      dispatch(setQuantityValues({quantityInCart: cartQuantity}));
    }
    if (buttonPressed && !success && msg == 'OutOfStock') {
      _setModalData(t('OutOfStock'), {minHeight: '20%'});
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
    <View>
      <View style={styles.productDetailsFooter}>
        {!isOutOfStock && (
          <>
            <Counter
              count={count}
              increaseCount={increaseCount}
              decreaseCount={decreaseCount}
              styleCounter={{marginTop: 0 * BW()}}
            />
            <TouchableOpacity
              style={[styles.square, {flex: 2}]}
              onPress={handleBuyNow}>
              <Text h3 bold>
                {t('buyNow')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loader}
              style={[
                styles.square,
                {flex: 3, backgroundColor: colors.backgroundDark},
              ]}
              onPress={() => handleAddToCart(false)}>
              {loader ? (
                <Loader
                  style={{backgroundColor: 'transparent'}}
                  isLoading={loader}
                  color={'#fff'}
                />
              ) : (
                <Text h3 bold style={{color: 'white'}}>
                  {t('addToCart')}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
export default Footer;
const getStyle = (colors: any) =>
  StyleSheet.create({
    productDetailsFooter: {
      padding: 10 * BW(),
      bottom: 10 * BW(),
      left: 0,
      right: 0,
      flexDirection: 'row',
      gap: 8 * BW(),
      paddingTop: 20 * BW(),
      borderTopColor: '#E7E7E7',
      borderTopWidth: 1 * BW(),
      backgroundColor: colors.background,
    },
    square: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48 * BH(),
      borderRadius: 10 * BW(),
      borderColor: colors.gray + 'cc',
      borderWidth: 1 * BW(),
      flex: 1,
    },
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });
