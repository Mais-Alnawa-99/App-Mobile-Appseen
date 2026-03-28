import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useTheme } from '@react-navigation/native';
import { BW } from '../../style/theme';
import Text from '../../component/Text';
import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Locations from '../auth/customer/Locations';
import { getShippingAddress } from '../../redux/reducers/cart/thunk/shippingAddress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

function ShippingAddress(props: any): JSX.Element {
  const orderId = props?.route?.params?.orderId;
  const { colors } = useTheme();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { personalInfo, addressLoading } = useAppSelector(
    state => state.ShippingAddress,
  );
  const { dataLoader: userLocationsLoader } = useAppSelector(
    state => state.locations,
  );
  const isLoading = addressLoading && userLocationsLoader;

  const handleAddress = () => {
    if (authenticatedUser) {
      dispatch(
        getShippingAddress({
          userId: authenticatedUser,
          orderId: orderId,
        }),
      ).then(res => {});
    }
  };

  useEffect(() => {
    handleAddress();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={isLoading}>
        <Header hideDrawer title={t('myAddresses')} />
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <View>
              <Locations shipping />
              {!!personalInfo && (
                <View style={{ paddingHorizontal: 10 * BW() }}>
                  <Text h2 bold style={{ marginBottom: 6 * BW() }}>
                    {t('personalInfo')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10 * BW(),
                      alignItems: 'center',
                    }}
                  >
                    <AntDesign name="home" size={16 * BW()} color={'#000'} />
                    <Text h3 style={{ color: '#2C2D3099' }}>
                      {personalInfo?.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10 * BW(),
                      alignItems: 'center',
                    }}
                  >
                    <Feather
                      name="phone-call"
                      size={16 * BW()}
                      color={'#000'}
                    />
                    <Text h3 style={{ color: '#2C2D3099' }}>
                      {personalInfo?.mobile}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10 * BW(),
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={16 * BW()}
                      color={'#000'}
                    />
                    <Text h3 style={{ color: '#2C2D3099' }}>
                      {personalInfo?.email}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View style={{ paddingHorizontal: 10 * BW() }}>
              <Button
                title={t('continue')}
                h3
                style={{
                  backgroundColor: colors.primary,
                  height: 'auto',
                  marginVertical: 18 * BW(),
                }}
                styleText={{ color: '#fff' }}
                onPress={() =>
                  NavigationService.push('CheckOut', { orderId: orderId })
                }
              />
            </View>
          </View>
        </ScrollView>
      </Loader>
    </View>
  );
}
export default ShippingAddress;
