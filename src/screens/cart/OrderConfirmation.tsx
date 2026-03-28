import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
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
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Header from '../../component/Header';
import {URL} from '../../redux/network/api';
import {useTranslation} from 'react-i18next';
import Loader from '../../component/Loader';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {BW, BH} from '../../style/theme';
import Text from '../../component/Text';
import {setModalData} from '../../redux/reducers/modal';
import {getGeneralStyle} from '../../style/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {getCheckOut} from '../../redux/reducers/cart/thunk/checkOut';
import FlatListComp from '../../component/FlatList';
import CustomImage from '../../component/CustomImage';
import {isArabic} from '../../locales';
import Counter from '../products/productdetails/Counter';
import {updateLinesInCart} from '../../redux/reducers/cart/thunk/updateLine';
import {setQuantityValues} from '../../redux/reducers/cart/slice/quantity';
import NavigationService from '../../naigation/NavigationService';
import Button from '../../component/Button';
import Input from '../../component/Input';
import {discountCode} from '../../redux/reducers/cart/thunk/discountCode';
import {getPaymentLink} from '../../redux/reducers/cart/thunk/paymentLink';
import {getOrderConfirmation} from '../../redux/reducers/cart/thunk/OrderConfimation';
import appsFlyer from 'react-native-appsflyer';
function OrderConfirmation(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {isLoggedIn, authenticatedUser} = useAppSelector(state => state.auth);
  const orderId = useAppSelector(state => state.order.orderId);
  const {data, orderSummary, extraParams, checkOutLoading, checkOutError} =
    useAppSelector(state => state.orderConfirmation);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const _setModalData = (msg: string, style?: any) => {
    dispatch(
      setModalData({
        modalVisible: true,
        message: msg,
        customStyle: style,
      }),
    );
  };
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const sleep = (ms: number) =>
    new Promise<void>(resolve => {
      setTimeout(() => resolve(), ms);
    });

  const handleOrder = async () => {
    if (authenticatedUser) {
      setLoading(true);
      try {
        let attempt = 0;
        const maxAttempts = 20;
        let waiting = true;

        do {
          attempt++;
          const res: any = await dispatch(
            getOrderConfirmation({
              userId: authenticatedUser,
              orderId: orderId,
            }),
          );
          waiting = !!res?.payload?.result?.waiting;
          if (!waiting) {
            break;
          }
          if (attempt >= maxAttempts) {
            console.warn(
              `handleOrder: reached maxAttempts (${maxAttempts}). Stopping polling.`,
            );
            break;
          }
          const delayMs = 1000;
          await sleep(delayMs);
          if (!isMounted.current) {
            return;
          }
        } while (waiting);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (authenticatedUser) {
      handleOrder();
    }
  }, [authenticatedUser]);

  const globalLoading = loading || checkOutLoading;
  useEffect(() => {
    if (data?.total_price && authenticatedUser) {
      appsFlyer.logEvent(
        'purchase',
        {
          user_id: authenticatedUser,
          order_id: orderId,
          af_revenue: data?.total_price?.amount_total,
          af_currency: 'AED',
        },
        result => console.log('Appsflyer purchase event logged:', result),
        error => console.error('Appsflyer purchase event error:', error),
      );
    }
  }, [data, authenticatedUser]);
  if (globalLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{alignItems: 'center'}}>
          <Loader isLoading={true} inline />
          <Text h3 bold style={{marginTop: 8 * BW()}}>
            {t('YourRequest')}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <Header hideDrawer title={t('orderDetails')} />
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 14 * BW(), marginVertical: 12 * BW()}}>
        <View
          style={{
            paddingHorizontal: 12 * BW(),
            paddingVertical: 6 * BW(),
            backgroundColor: '#e8e9e8ff',
            borderRadius: 8 * BW(),
          }}>
          <Text h2 bold>
            {data?.message}
          </Text>
        </View>
        <View style={{marginVertical: 16 * BW()}}>
          <Text h2 bold>
            {t('paymentInfo')} :
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomColor: colors.gray,
              borderBottomWidth: 0.6 * BW(),
              marginVertical: 16 * BW(),
            }}>
            <Text h2 bold>
              {t('total')} :{' '}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 6 * BW(),
                alignItems: 'center',
              }}>
              {!isArabic() && data?.total_price?.currency_symbol == 'ᴁ' && (
                <Image
                  source={require('../../assets/icons/dirham.png')}
                  style={generalStyles.currencyImage}
                />
              )}
              <Text h2 bold>
                {data?.total_price?.amount_total}
              </Text>
              {isArabic() && data?.total_price?.currency_symbol == 'ᴁ' && (
                <Image
                  source={require('../../assets/icons/dirham.png')}
                  style={generalStyles.currencyImage}
                />
              )}
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 12 * BW(),
              paddingVertical: 6 * BW(),
              backgroundColor: '#d4edda',
              borderRadius: 8 * BW(),
            }}>
            <Text h4 style={{color: '#659277'}}>
              {t('yourPaymentHasbeenSuccessfully')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 4 * BW(),
              marginVertical: 8 * BW(),
            }}>
            <Text h3 bold>
              {t('shippingAddress')} :
            </Text>
            <Text h3>{data?.Shipping_Address}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
export default OrderConfirmation;

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
      // marginTop: 8 * BW(),
      // paddingHorizontal: 12 * BW(),
      // paddingVertical: 12 * BW(),
      paddingBottom: 20 * BW(),
      // minHeight: 50 * BW(),
    },
  });
