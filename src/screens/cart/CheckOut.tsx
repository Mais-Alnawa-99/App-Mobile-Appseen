import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { URL } from '../../redux/network/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import Text from '../../component/Text';
import { setModalData } from '../../redux/reducers/modal';
import { getGeneralStyle } from '../../style/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { getCheckOut } from '../../redux/reducers/cart/thunk/checkOut';
import FlatListComp from '../../component/FlatList';
import CustomImage from '../../component/CustomImage';
import { isArabic } from '../../locales';
import Counter from '../products/productdetails/Counter';
import { updateLinesInCart } from '../../redux/reducers/cart/thunk/updateLine';
import { setQuantityValues } from '../../redux/reducers/cart/slice/quantity';
import NavigationService from '../../naigation/NavigationService';
import Button from '../../component/Button';
import Input from '../../component/Input';
import { discountCode } from '../../redux/reducers/cart/thunk/discountCode';
import { getPaymentLink } from '../../redux/reducers/cart/thunk/paymentLink';
import { setOrderValue } from '../../redux/reducers/cart/slice/order';
import appsFlyer from 'react-native-appsflyer';

function CheckOut(props: any): JSX.Element {
  const orderId = props?.route?.params?.orderId;
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [discountCode_, setDiscountCode_] = useState('');
  const [discountMsg, setDiscountMsg] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const {
    address,
    orderSummary,
    extraParams,
    countItems,
    orderItems,
    checkOutLoading,
    checkOutError,
  } = useAppSelector(state => state.checkOut);
  const [updateLineStockMsgs, setUpdateLineStockMsgs] = useState<{
    [key: number]: string;
  }>({});
  const _setModalData = (msg: string, style?: any) => {
    dispatch(
      setModalData({
        modalVisible: true,
        message: msg,
        customStyle: style,
      }),
    );
  };

  const handleCheckOut = () => {
    if (authenticatedUser) {
      dispatch(
        getCheckOut({
          userId: authenticatedUser,
          orderId: orderId,
        }),
      ).then(res => {});
    }
  };

  useEffect(() => {
    if (authenticatedUser) {
      handleCheckOut();
    }
  }, []);
  useEffect(() => {
    if (updateSuccess) {
      handleCheckOut();
      setUpdateSuccess(false);
    }
  }, [updateSuccess]);
  const increaseQuantity = (
    orderId: number,
    lineId: number,
    accessToken: string,
  ) => {
    dispatch(updateLinesInCart({ orderId, lineId, accessToken })).then(res => {
      if (res?.payload?.result?.data?.success) {
        setUpdateSuccess(true);
        appsFlyer.logEvent(
          'add_to_cart',
          {
            order_id: orderId,
            user_type: 'guest',
          },
          result => console.log('Appsflyer add_to_cart (guest):', result),
          error => console.error('Appsflyer add_to_cart error:', error),
        );
        if (res.payload?.result?.data?.cart_quantity) {
          dispatch(
            setQuantityValues({
              quantityInCart: res.payload?.result?.data?.cart_quantity,
            }),
          );
        }
      }
      if (res?.payload?.result?.data?.successIncreaseLine == false) {
        const msg = res?.payload?.result?.msg || '';
        setUpdateLineStockMsgs(prevMsgs => ({
          ...prevMsgs,
          [lineId]: msg,
        }));
      }
    });
  };

  const decreaseQuantity = (
    orderId: number,
    lineId: number,
    accessToken: string,
  ) => {
    dispatch(
      updateLinesInCart({ orderId, lineId, accessToken, remove: true }),
    ).then(res => {
      if (res?.payload?.result?.data?.success) {
        setUpdateSuccess(true);
        setUpdateLineStockMsgs(prevMsgs => {
          const updatedMsgs = { ...prevMsgs };
          delete updatedMsgs[lineId];
          return updatedMsgs;
        });
        if (
          res.payload?.result?.data?.cart_quantity ||
          res.payload?.result?.data?.cart_quantity == 0
        ) {
          dispatch(
            setQuantityValues({
              quantityInCart: res.payload?.result?.data?.cart_quantity,
            }),
          );
        }
      }
    });
  };

  const renderItem = ({ item, index }: { item: any; index: any }) => {
    const imageFullPath = URL + item?.image_128;
    return (
      <View style={{ width: 80 * BW() }}>
        <CustomImage
          url={imageFullPath}
          resizeMode={'cover'}
          style={styles.image}
        />
        <View
          style={{ flexDirection: 'row', gap: 2 * BW(), alignItems: 'center' }}
        >
          {!isArabic() && item?.currency_symbol === 'ᴁ' && (
            <Image
              source={require('../../assets/icons/dirham.png')}
              style={[generalStyles.currencyImage]}
            />
          )}
          <Text h3 bold>
            {item?.price_unit}
          </Text>
          {isArabic() && item?.currency_symbol === 'ᴁ' && (
            <Image
              source={require('../../assets/icons/dirham.png')}
              style={generalStyles.currencyImage}
            />
          )}
        </View>
        <Counter
          count={item?.quantity}
          increaseCount={() =>
            increaseQuantity(
              extraParams?.order_id,
              item?.order_line,
              extraParams?.access_token,
            )
          }
          decreaseCount={() =>
            decreaseQuantity(
              extraParams?.order_id,
              item?.order_line,
              extraParams?.access_token,
            )
          }
          cart
        />
        {!!updateLineStockMsgs[item?.order_line] && (
          <Text h5 style={{ color: '#ff0000cc' }} numberOfLines={4}>
            {updateLineStockMsgs[item?.order_line]}
          </Text>
        )}
      </View>
    );
  };

  const handleApplyCode = async (orderId: string) => {
    dispatch(
      discountCode({
        promoCode: discountCode_,
        orderId,
      }),
    ).then(s => {
      if (s.payload?.result?.data?.successPromo) {
        handleCheckOut();
      } else {
        // _setModalData(s.payload?.result?.msg);
        setDiscountMsg(s.payload?.result?.msg);
      }
    });
    setDiscountCode_('');
  };
  const handlePaymentLink = () => {
    if (authenticatedUser) {
      dispatch(
        getPaymentLink({
          userId: authenticatedUser,
          orderId: orderId,
        }),
      ).then(res => {
        dispatch(setOrderValue({ order: orderId }));
        if (
          res?.payload?.result?.status == 'success' &&
          !!res?.payload?.result?.data?.payment_link
        ) {
          NavigationService.navigate('WebViewScreen', {
            url: res?.payload?.result?.data?.payment_link,
          });
        } else {
          _setModalData(t('someThingWrong'));
        }
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={checkOutLoading}>
        <Header hideDrawer title={t('checkOut')} />
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 16 * BW() }}
        >
          <View style={{ marginBottom: 16 * BW() }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 6 * BW(),
                alignItems: 'center',
                marginBottom: 6 * BW(),
              }}
            >
              <Image
                source={require('../../assets/icons/location.png')}
                style={styles.icon}
              />
              <Text h2 bold>
                {t('shippingAddress')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 8 * BW(),
                alignItems: 'center',
              }}
            >
              <Text h3 style={styles.text}>
                {t('name')} :
              </Text>
              <Text h3>{address?.name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 8 * BW(),
                alignItems: 'center',
              }}
            >
              <Text h3 style={styles.text}>
                {t('email')} :
              </Text>
              <Text h3>{address?.email}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 8 * BW(),
                alignItems: 'center',
              }}
            >
              <Text h3 style={styles.text}>
                {t('mobileNumber')} :
              </Text>
              <Text h3>{address?.mobile}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 8 * BW(),
                alignItems: 'center',
                width: '75%',
              }}
            >
              <Text h3 style={styles.text}>
                {t('location')} :
              </Text>
              <Text h3 numberOfLines={1} ellipsizeMode="tail">
                {address?.shipping_address}
              </Text>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', justifyContent: 'flex-end' }}
                onPress={() => {
                  NavigationService.navigate('ShippingAddress', {
                    orderId: extraParams?.order_id,
                  });
                }}
              >
                <Image
                  source={
                    isArabic()
                      ? require('../../assets/icons/back.png')
                      : require('../../assets/icons/next.png')
                  }
                  style={styles.next}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginBottom: 16 * BW() }}>
            <TouchableOpacity>
              <Text h2 bold>
                {t('orderItems')} ({countItems})
              </Text>
            </TouchableOpacity>
            <FlatListComp
              data={orderItems}
              renderItem={renderItem}
              listkey={'$'}
              contentContainerStyle={{
                alignSelf: 'flex-start',
                gap: 18 * BW(),
              }}
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          </View>
          {!!orderSummary && Object.keys(orderSummary).length > 0 && (
            <View style={styles.productContainer}>
              <Text h2 bold>
                {t('orderSummury')}
              </Text>
              <View style={{ gap: 4 * BW() }}>
                {Object.keys(orderSummary).map(key => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text h4 key={key}>
                      {t(key)}:
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4 * BW(),
                      }}
                    >
                      <Text h4>
                        {orderSummary[key] % 1 !== 0
                          ? orderSummary[key]
                          : orderSummary[key]}{' '}
                      </Text>
                      {!isArabic() &&
                        extraParams?.currency_symbol == 'ᴁ' &&
                        key !== 'currency' && (
                          <Image
                            source={require('../../assets/icons/dirham.png')}
                            style={[
                              generalStyles.currencyImage,
                              { width: 12 * BW(), height: 12 * BW() },
                            ]}
                          />
                        )}

                      {isArabic() &&
                        extraParams?.currency_symbol == 'ᴁ' &&
                        key !== 'currency' && (
                          <Image
                            source={require('../../assets/icons/dirham.png')}
                            style={[
                              generalStyles.currencyImage,
                              { width: 12 * BW(), height: 12 * BW() },
                            ]}
                          />
                        )}
                    </View>
                  </View>
                ))}
              </View>
              <View style={{ gap: 8 * BW(), marginTop: 8 * BW() }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Input
                    label={isArabic() ? 'كود الخصم' : 'Discount Code'}
                    placeholder={
                      isArabic()
                        ? '  يرجى ادخال كود الخصم  '
                        : 'Enter your discount code'
                    }
                    value={discountCode_}
                    onChangeText={text => setDiscountCode_(text)}
                    type="textInput"
                    required={false}
                    error={null}
                    viewStyle={{ width: '84%' }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      handleApplyCode(extraParams?.order_id);
                    }}
                    disabled={loadingCode || discountCode_.trim() === ''}
                    style={{
                      marginTop: 38 * BW(),
                      backgroundColor: colors.primary,
                      height: 36 * BW(),
                      paddingVertical: 2 * BW(),
                      paddingHorizontal: 8 * BW(),
                      borderRadius: 4 * BW(),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text h4 style={{ color: '#fff' }}>
                      {t('apply')}
                    </Text>
                  </TouchableOpacity>
                </View>
                {!!discountMsg && (
                  <Text h3 style={{ color: '#ff0000' }}>
                    {discountMsg}
                  </Text>
                )}

                {extraParams?.reward_exist && (
                  <Text h3 bold style={{ color: '#2a8f2abf' }}>
                    {extraParams?.promo_msg}
                  </Text>
                )}
                <Button
                  h3
                  style={{ backgroundColor: colors.primary, height: 'auto' }}
                  styleText={{ color: '#fff' }}
                  title={t('placeOrder')}
                  onPress={() => {
                    handlePaymentLink();
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </Loader>
    </View>
  );
}
export default CheckOut;

const getStyle = (colors: any) =>
  StyleSheet.create({
    image: {
      width: 90 * BW(),
      height: 120 * BW(),
    },
    currencyImage: {
      width: 12 * BW(),
      height: 12 * BW(),
      resizeMode: 'contain',
      tintColor: '#000',
    },
    icon: {
      width: 14 * BW(),
      height: 14 * BW(),
      resizeMode: 'contain',
    },
    text: {
      color: '#646464',
    },
    next: {
      width: 26 * BW(),
      height: 26 * BW(),
      resizeMode: 'contain',
      tintColor: '#000',
    },
    productContainer: {
      backgroundColor: '#fff',
      width: '100%',
      paddingBottom: 20 * BW(),
    },
  });
