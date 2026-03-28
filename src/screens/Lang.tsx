import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  I18nManager,
  Platform,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import RNRestart from 'react-native-restart';

import Button from '../component/Button';
import theme, {BH, BW} from '../style/theme';
import {reduxStorage, store, useAppSelector} from '../redux/store';
import i18n from 'i18next';
import Text from '../component/Text';
import Input from '../component/Input';
// import MyLocation from '../component/Location';
import {useTranslation} from 'react-i18next';
import {setLangValue} from '../redux/reducers/User/lang';

export const _setLang = async (lang: string) => {
  const isLangRTL = lang === 'ar';
  await store.dispatch(setLangValue(lang));
  await reduxStorage.setItem('lang', lang);
  await i18n.changeLanguage(lang);
  if (Platform.OS !== 'ios') {
    await I18nManager.allowRTL(isLangRTL);
  }
  await I18nManager.forceRTL(isLangRTL);
  RNRestart.restart();
};

function Lang(): JSX.Element {
  const {colors} = useTheme();
  const {isLandscape} = useAppSelector(state => state.dimensions);
  const {width, height} = Dimensions.get('window');
  const styles = getStyle(colors, isLandscape, width, height);
  const [lanSelected, setLangSelected] = useState('ar');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(false);
  const {t} = useTranslation();

  return (
    <View style={styles.appContainer}>
      <View style={styles.container}>
        <Animatable.View
          duration={1000}
          delay={200}
          animation={'fadeInDownBig'}
          style={styles.logoContainer}>
          <Image
            source={require('../assets/loginBg/start.png')}
            style={styles.image}
          />

          {/* <Text h1 bold style={{ textAlign: 'center', marginTop: 10 * BW() }}>
            From UAE to the world
          </Text> */}
        </Animatable.View>
        <Animatable.View
          duration={1000}
          delay={200}
          animation={'fadeInUpBig'}
          style={styles.langView}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.0)']}
            style={styles.gradient}>
            <Text h1 bold style={{marginTop: 20 * BW()}}>
              {t('fromUaeToTheWorld')}
            </Text>
            <View style={styles.underline} />
            <Input
              dropdown
              onChangeValue={(item: any) => setLangSelected(item.value)}
              value={lanSelected}
              label={'Preferred Language'}
              styleText={{
                color: colors.darkBorder + 'bb',
                marginTop: 80 * BW(),
              }}
              styleInput={{
                paddingVertical: 0,
                marginTop: 0 * BW(),
                padding: 6 * BW(),
                minHeight: 45 * BW(),
                borderWidth: 0.8 * BW(),
                paddingHorizontal: 6 * BW(),
                borderRadius: 10 * BW(),
                backgroundColor: colors.background,
                borderColor: colors.border,
              }}
              error={error && !lanSelected}
              items={[
                {
                  label: 'العربية (الإمارات العربية المتحدة)',
                  value: 'ar',
                  icon: require('../assets/lang/arabic.png'),
                },
                {
                  label: 'English (United Stated)',
                  value: 'en',
                  icon: require('../assets/lang/english.png'),
                },
              ]}
              renderLeftIcon={() =>
                !!lanSelected &&
                (lanSelected == 'ar' ? (
                  <Image
                    source={require('../assets/lang/arabic.png')}
                    style={{
                      width: 25 * BW(),
                      height: 25 * BW(),
                      resizeMode: 'contain',
                      marginRight: 12 * BW(),
                    }}
                  />
                ) : (
                  <Image
                    source={require('../assets/lang/english.png')}
                    style={{
                      width: 25 * BW(),
                      height: 25 * BW(),
                      marginRight: 12 * BW(),
                      resizeMode: 'contain',
                    }}
                  />
                ))
              }
              renderItemProps={item => {
                return (
                  <View
                    style={{
                      paddingVertical: 5 * BW(),
                      alignItems: 'center',
                      flexDirection: 'row',
                      padding: 6 * BW(),
                      marginVertical: 6 * BW(),
                    }}>
                    <Image
                      source={item.icon}
                      style={{
                        width: 25 * BW(),
                        height: 25 * BW(),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      h4
                      style={{
                        marginLeft: 12 * BW(),
                      }}>
                      {item.label}
                    </Text>
                  </View>
                );
              }}
            />
            {/* <MyLocation
              style={
                error && !location ? styles.locationError : styles.location
              }
              styleAddress={styles.styleAddress}
              label={'Location'}
              styleLabel={{color: colors.darkBorder + 'bb'}}
              styleContainer={{marginTop: 20 * BW()}}
              icon={require('../assets/icons/map.png')}
              styleIcon={{width: 20 * BW(), height: 20 * BW()}}
              press={true}
              setLocationProps={value => setLocation(value)}
              styleInput={{
                borderRadius: 10 * BW(),
                backgroundColor: colors.background,
                borderColor: colors.border,
              }}
            /> */}
            <View
              style={styles.buttonsView}
              onTouchEnd={() => !lanSelected && setError(true)}>
              <Button
                h2
                style={styles.buttonStyle}
                title={'Next'}
                styleIcon={styles.styleIcon}
                styleText={
                  !lanSelected ? {color: colors.textGray} : styles.styleText
                }
                disabled={!lanSelected}
                backgroundColorDisabled={'#F5F5F5'}
                onPress={() => {
                  _setLang(lanSelected);
                }}
              />
            </View>
          </LinearGradient>
        </Animatable.View>
      </View>
    </View>
  );
}

const getStyle = (
  colors: any,
  isLandscape: boolean,
  height: number,
  width: number,
) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 360 * BH(),
      width: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: isLandscape ? 'row' : 'column',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    langView: {
      position: 'absolute',
      top: height * 0.5,
      width: '100%',
      padding: 20 * BW(),
      borderRadius: 10 * BW(),
    },
    gradient: {
      padding: 20 * BW(),
      borderRadius: 10 * BW(),
    },
    underline: {
      height: 3 * BH(),
      width: 80 * BW(),
      backgroundColor: colors.golden,
      marginTop: 2,
    },
    startInfo: {},
    btnSubmit: {
      backgroundColor: colors.primary,
      height: 'auto',
      paddingVertical: 8 * BW(),
      paddingHorizontal: 40 * BW(),
      borderRadius: 35 * BW(),
      width: 'auto',
      alignSelf: 'center',
      marginVertical: 20 * BW(),
    },
    buttonStyle: {
      height: 'auto',
      width: '100%',
      marginHorizontal: 5 * BW(),
      justifyContent: 'space-around',
      backgroundColor: '#3D3D3D',
      borderRadius: 10 * BW(),
      minHeight: 40 * BW(),
    },
    styleIcon: {
      width: 35 * BW(),
      height: 35 * BW(),
    },
    buttonsView: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 30 * BW(),
    },
    styleText: {
      color: colors.background,
    },
    location: {
      paddingVertical: 0,
      padding: 6 * BW(),
      minHeight: 45 * BW(),
      borderWidth: 0.8 * BW(),
      paddingHorizontal: 8 * BW(),
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 10 * BW(),
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
    },
    locationError: {
      paddingVertical: 0,
      padding: 6 * BW(),
      minHeight: 45 * BW(),
      borderWidth: 0.5 * BW(),
      paddingHorizontal: 8 * BW(),
      backgroundColor: colors.background,
      borderColor: 'red',
      borderRadius: 8 * BW(),
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
    },
    styleAddress: {
      marginLeft: 0,
    },
  });

export default Lang;
