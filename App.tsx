/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  I18nManager,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { persistor, reduxStorage, store } from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { clearLangValue, setLangValue } from './src/redux/reducers/User/lang';
import i18next from 'i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getTheme } from './src/redux/reducers/theme/thunk/theme';
import { setModalData } from './src/redux/reducers/modal';
import { getVersion } from './src/redux/reducers/getVersion';
import { buildVersion } from './app.json';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/naigation/App';
import { initNotificationService } from './src/pushNotification';
import appsFlyer from 'react-native-appsflyer';
import { production } from './app.json';
import SplashVideo from './src/component/SplashVideo';
import reactotron from 'reactotron-react-native';

function App() {
  const { t } = useTranslation();
  const [l, setL] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const inialLang = async () => {
    let lang = await reduxStorage.getItem('lang');
    if (lang != null) {
      await store.dispatch(setLangValue(lang));
      if (lang === 'ar') {
        if (Platform.OS !== 'ios') {
          I18nManager.allowRTL(true);
        }
        I18nManager.forceRTL(true);
      } else {
        if (Platform.OS !== 'ios') {
          I18nManager.allowRTL(false);
        }
        I18nManager.forceRTL(false);
      }
      await i18next.changeLanguage(lang);
    } else {
      store.dispatch(clearLangValue());
    }
    checkVersion();

    await i18next.changeLanguage(lang);
    setL(false);
  };
  // Check Version
  const checkVersion = () => {
    store.dispatch(getVersion({})).then((res: any) => {
      if (res?.payload?.result?.status == 'success') {
        let data = res?.payload?.result?.data || {};
        let forceUpdate = data?.force_update;
        let androidVersion = data?.version_number_android;
        let iosVersion = data?.version_number_ios;
        let andriodUrl = data?.android_url;
        let iosUrl = data?.ios_url;
        if (
          Platform.OS === 'android' &&
          parseInt(androidVersion) > buildVersion
        ) {
          _setModalData(forceUpdate, iosUrl, andriodUrl);
        } else if (
          Platform.OS === 'ios' &&
          parseInt(iosVersion) > buildVersion
        ) {
          _setModalData(forceUpdate, iosUrl, andriodUrl);
        }
      }
    });
  };

  const _setModalData = (
    forceUpdate: boolean,
    iosUrl: string,
    andriodUrl: string,
  ) => {
    if (!andriodUrl) {
      andriodUrl =
        'https://play.google.com/store/apps/details?id=com.marketplaceseenapp.shopping';
    }
    if (!iosUrl) {
      iosUrl =
        'https://apps.apple.com/ae/app/seen-online-shopping/id6503211605';
    }
    store.dispatch(
      setModalData({
        modalVisible: true,
        title: t('newVersion'),
        message: t('msgVersion'),
        hideCancel: forceUpdate ? true : false,
        hideConfirm: false,
        titleConfirm: t('update'),
        fun: () => {
          Linking.openURL(Platform.OS === 'ios' ? iosUrl : andriodUrl);
        },
      }),
    );
  };

  useEffect(() => {
    reactotron.log('App started');
    // Wait a tick before hiding native splash

    store.dispatch(getTheme()).then(res => {});
    initNotificationService();
    inialLang();
    if (production) {
      const options = {
        devKey: 'ZgUXccyTihojhqmyxtqNRV',
        isDebug: true,
        ...(Platform.OS === 'ios' && { appId: 'id6503211605' }),
      };

      appsFlyer.initSdk(
        options,
        result => console.log('Appsflyer initialized (production):', result),
        error => console.error('Appsflyer init error:', error),
      );
    } else {
      console.log('Appsflyer disabled — not production build');
    }
  }, []);

  // here we can set token mobile for all api's

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar
            translucent={true}
            backgroundColor={'transparent'}
            barStyle="dark-content"
          />

          <GestureHandlerRootView style={{ flex: 1 }}>
            {showVideo && <SplashVideo onFinish={() => setShowVideo(false)} />}
            <AppNavigator />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
