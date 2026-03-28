import React from 'react';
import {StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import {t} from 'i18next';
import Text from '../../component/Text';
import {BH, BW} from '../../style/theme';
import {useTheme} from '@react-navigation/native';
import NavigationService from '../../naigation/NavigationService';
import {isArabic} from '../../locales';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../component/Header';
import Settings from './customer/Settings';
import {version} from '../../../app.json';
function GeustSettings(): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  return (
    <>
      <View style={{flex: 1, backgroundColor: colors.mainBackground}}>
        <Header
          hideDrawer
          hideNotification
          title={t('seen')}
          titleCenter
          hideTitle
          hideBack
          titleCenterBold
        />
        <View
          style={{
            paddingVertical: 40 * BW(),
            paddingHorizontal: 16 * BW(),
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: colors.background,
          }}>
          <Text h3>{t('welcomseen')} </Text>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate('Login', {});
            }}>
            <Text h3 bold>
              {' ' + t('login')}
            </Text>
          </TouchableOpacity>
          <Text h3> {t('or')} </Text>
          <TouchableOpacity
            onPress={() => NavigationService.navigate('CustomerSignup', {})}>
            <Text h3 bold>
              {t('signUp')}
            </Text>
          </TouchableOpacity>
        </View>
        <Settings
          hideTitle
          geust
          style={{
            backgroundColor: colors.background,
            marginTop: 4 * BW(),
            paddingTop: 0,
            flex: 0,
          }}
          settingsContainerStyle={{marginVertical: 0 * BW()}}
        />

        <View
          style={{
            paddingHorizontal: 16 * BW(),
            alignItems: 'center',
            marginBottom: 32 * BW(),
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '60%',
            }}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.facebook.com/seenappuae/')
              }>
              <Image
                source={require('../../assets/icons/facebook.png')}
                style={{width: 20 * BW(), height: 20 * BW()}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://www.instagram.com/seenappuae?igsh=MXB4YnAzMG5pYXRqbw==',
                )
              }>
              <Image
                source={require('../../assets/icons/instagram.png')}
                style={{width: 20 * BW(), height: 20 * BW()}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://wa.me/+971586861982')}>
              <Image
                source={require('../../assets/icons/whattsapp.png')}
                style={{width: 20 * BW(), height: 20 * BW()}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              marginVertical: 20 * BW(),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate('WebViewScreen', {
                  url: isArabic()
                    ? 'https://seen.ae/ar/privacy-policy'
                    : 'https://seen.ae/privacy-policy',
                });
              }}>
              <Text h4>{t('privacyPolicy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('WebViewScreen', {
                  url: isArabic()
                    ? 'https://seen.ae/ar/terms-of-use'
                    : 'https://seen.ae/terms-of-use',
                })
              }>
              <Text h4>{t('termsOfUse')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('WebViewScreen', {
                  url: isArabic()
                    ? 'https://seen.ae/ar/terms'
                    : 'https://seen.ae/terms',
                })
              }>
              <Text h4>{t('termsConditions')}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16 * BW(),
            }}>
            <Text h5 style={{color: colors.gray}}>
              {t('VersionNumber') + ' (' + version + ')'}
            </Text>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 15 * BW(),
            width: '100%',
            alignItems: 'center',
          }}>
          <Text h5 style={{color: colors.gray}}>
            {t('allRightsReserved')} © {new Date().getFullYear()}
          </Text>
        </View>
      </View>
    </>
  );
}
export default GeustSettings;
const getStyle = (colors: any) => StyleSheet.create({});
