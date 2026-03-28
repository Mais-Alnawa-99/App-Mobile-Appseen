import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Button, BackHandler} from 'react-native';
import WebViewCustom from '../component/WebView';
import NavigationService from '../naigation/NavigationService';
import Header from '../component/Header';
import {isArabic} from '../locales';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {
  getSessionId,
  getSessionPublicId,
} from '../redux/reducers/User/thunk/login';
import {clearAuthValues} from '../redux/reducers/User/startup';
import {setSessionValues} from '../redux/reducers/User/session';

function WebViewScreen(props: any): JSX.Element {
  let params = props?.route?.params;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {sessionPublic} = useAppSelector(store => store.session);

  const [sessionId, setSessionId] = useState<any>();
  const {isLoggedIn} = useAppSelector(store => store.auth);

  const dispatch = useAppDispatch();
  const webviewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const _getSessionId = () => {
    if (isLoggedIn) {
      dispatch(getSessionId({is_logged_in: isLoggedIn})).then(res => {
        if (res.payload?.result && !!res.payload?.result?.session) {
          setSessionId(res.payload?.result?.session);
        } else {
          setSessionId('public_user');
          dispatch(clearAuthValues());
        }
      });
    } else {
      // if (!sessionPublic) {
      dispatch(
        getSessionPublicId({is_logged_in: false, session_id: sessionPublic}),
      ).then(res => {
        if (res.payload?.result && !!res.payload?.result?.session) {
          setSessionId(res.payload?.result?.session);
          dispatch(setSessionValues({session: res.payload?.result?.session}));
        } else {
          setSessionId('public_user');
        }
      });
      // } else {
      //   setSessionId(sessionPublic);
      // }
    }
  };
  useEffect(() => {
    _getSessionId();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webviewRef?.current) {
        webviewRef.current.goBack();
        return true;
      } else {
        props?.navigation.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <View style={styles.appContainer}>
      {!!sessionId && (
        <WebViewCustom
          ref={webviewRef}
          url={
            !!params?.url
              ? params?.url
              : isArabic()
                ? 'https://seen.ae/ar'
                : 'https://seen.ae/en'
          }
          sessionId={sessionId}
          hideBack={params?.hideBack}
          hideCart={params?.hideCart}
          withoutSession={params?.withoutSession}
          onNavigationStateChange={({
            url,
            canGoBack,
          }: {
            url: string;
            canGoBack: boolean;
          }) => setCanGoBack(canGoBack)}
        />
      )}
    </View>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    container: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
  });

export default WebViewScreen;
