import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Button from '../../../component/Button';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import Header from '../../../component/Header';
import {reduxStorage, store} from '../../../redux/store';
import {useFocusEffect} from '@react-navigation/native';
import {getuserLocations} from '../../../redux/reducers/User/thunk/locations';
import {getuserOrders} from '../../../redux/reducers/User/thunk/orders';
import NavigationService from '../../../naigation/NavigationService';

function Orders(): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const [isEmpty, setIsEmpty] = useState(false);
  const dispatch = useAppDispatch();
  const {
    userOrders,
    dataLoader: userOrdersLoader,
    error: ordersError,
  } = useAppSelector(state => state.orders);
  const {authenticatedUser} = useAppSelector(state => state.auth);
  useEffect(() => {
    dispatch(getuserOrders({userId: authenticatedUser})).then(res => {
      if (
        res?.payload?.result &&
        Array.isArray(res?.payload?.result?.data) &&
        res?.payload?.result?.data?.length == 0
      ) {
        setIsEmpty(true);
      }
    });
  }, [dispatch, authenticatedUser]);

  if (userOrdersLoader) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  if (ordersError) {
    return (
      <View>
        <Text>{t('Error loading profile data')}</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <>
        <Header hideDrawer hideNotification title={t('myOrders')} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingHorizontal: 20,
          }}>
          <Text h2 style={{textAlign: 'center', color: colors.gray}}>
            {t('noOrders')}
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Header hideDrawer hideNotification title={t('myOrders')} />

      <ScrollView style={styles.appContainer}>
        <View>
          {Array.isArray(userOrders) &&
            userOrders?.map((order: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.container}
                onPress={() =>
                  NavigationService.navigate('WebViewScreen', {
                    url: `${getBaseURL()}/my/orders/${order?.id.toString()}`,
                  })
                }>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#33333333',
                    paddingVertical: 16 * BW(),
                  }}>
                  <View style={styles.label}>
                    <Text h3 bold>
                      # {order?.name}
                    </Text>
                  </View>
                  <View style={{paddingHorizontal: 12 * BW()}}>
                    <View style={styles.row}>
                      <Text h3 bold>
                        {'date'} :
                      </Text>
                      <Text h4>{order?.order_date}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text h3 bold>
                        {t('total')} :
                      </Text>
                      <Text h4>{order?.total}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </>
  );
}

export default Orders;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    container: {
      paddingHorizontal: 16 * BW(),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4 * BW(),
    },
    label: {
      backgroundColor: '#FAFAFF',
      borderRadius: 10 * BW(),
      padding: 12 * BW(),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60 * BH(),
      marginVertical: 2 * BW(),
    },
  });
