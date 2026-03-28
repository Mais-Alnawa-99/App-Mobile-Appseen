import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {t} from 'i18next';
import Text from '../../component/Text';
import {BH, BW} from '../../style/theme';
import {useTheme} from '@react-navigation/native';
import Loader from '../../component/Loader';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';
import {isArabic} from '../../locales';
import Input from '../../component/Input';
import {Image} from 'react-native';
import {loginThunk} from '../../redux/reducers/User/thunk/login';
import {
  setAuthValues,
  clearAuthValues,
} from '../../redux/reducers/User/startup';
import {setModalData} from '../../redux/reducers/modal';
import {encodedMessage} from '../../component/Generalfunction';
import AppleSignIn from './customer/SignInWithApple';
import LinearGradient from 'react-native-linear-gradient';
import {getBaseURL} from '../../redux/network/api';
import {
  clearSessionValues,
  setSessionUserValues,
} from '../../redux/reducers/User/session';
import {getSessionId} from '../../redux/reducers/User/thunk/login';
import {quantityItemsInWishlist} from '../../redux/reducers/wishlist/thunk/wishListCount';
import {setQuantityWishlist} from '../../redux/reducers/wishlist/slice/quantityWishlist';
import appsFlyer from 'react-native-appsflyer';

export default function Login(props: any) {
  const {colors} = useTheme();
  const {width, height} = Dimensions.get('window');
  const styles = getStyle(colors, width, height);
  let params = props.route?.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const {loading} = useAppSelector(store => store.loader);
  const {isLogging} = useAppSelector(store => store.user.login);
  const {sessionPublic, sessionUser} = useAppSelector(state => state.session);
  const dispatch = useAppDispatch();
  const _setModalData = (msg: string) => {
    dispatch(
      setModalData({
        modalVisible: true,
        title: t('sorry'),
        message: msg,
      }),
    );
  };

  const _login = async () => {
    let passEncoded = await encodedMessage(password);

    let loginPayload = {
      password: passEncoded?.encodedMessage || password,
      username: email,
    };
    dispatch(loginThunk({payload: loginPayload})).then(res => {
      if (
        res.meta.requestStatus == 'fulfilled' &&
        res?.payload?.result?.status == 'success'
      ) {
        dispatch(
          setAuthValues({
            token: res?.payload?.result?.data?.token,
            authenticatedUser: res?.payload?.result?.data?.user_id,
            userName: res?.payload?.result?.data?.user_name,
          }),
        );
        appsFlyer.logEvent(
          'login',
          {
            method: 'email',
            user_id: res?.payload?.result?.data?.user_id,
          },
          result => console.log('Appsflyer login event logged:', result),
          error => console.error('Appsflyer login event error:', error),
        );
        dispatch(
          quantityItemsInWishlist({
            userId: res?.payload?.result?.data?.user_id,
            sessionId: sessionUser ? sessionUser : '',
          }),
        ).then(res => {
          if (
            res?.payload?.result?.type == 'calledSuccessfully' &&
            res?.payload?.result?.data
          ) {
            dispatch(
              setQuantityWishlist({
                quantityInWishlist: res?.payload?.result?.data?.count,
              }),
            );
          }
        });
        if (!sessionUser) {
          dispatch(getSessionId({is_logged_in: true})).then(res => {
            if (res.payload?.result && !!res.payload?.result?.session) {
              dispatch(
                setSessionUserValues({session: res.payload?.result?.session}),
              );
            } else {
              dispatch(clearAuthValues());
            }
          });
        }
        if (sessionPublic) {
          dispatch(clearSessionValues());
        }
        NavigationService.navigate('Profile', {});
      } else {
        _setModalData(res?.payload?.result?.msg);
      }
    });
  };
  return (
    <View style={styles.appContainer}>
      {(params?.fromService || params?.showBack) && (
        <Animatable.View
          duration={1000}
          style={styles.containerBackStyle}
          delay={500}
          animation={'fadeIn'}>
          <Button
            style={styles.backStyle}
            styleIcon={{
              tintColor: colors.primary,
              width: 20 * BW(),
              height: 20 * BW(),
              transform: [{rotate: !isArabic() ? '180deg' : '0deg'}],
            }}
            containerIcon={{width: 'auto', height: 'auto'}}
            onPress={() => NavigationService.goBack()}
            icon={require('../../assets/icons/back.png')}
          />
        </Animatable.View>
      )}

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animatable.View
          duration={1000}
          delay={200}
          animation={'fadeInDownBig'}
          style={[styles.logoContainer, {height: 340 * BH()}]}>
          <Image
            source={require('../../assets/loginBg/login.png')}
            style={styles.image}
          />
        </Animatable.View>

        <Animatable.View
          duration={1000}
          delay={200}
          animation={'fadeInUpBig'}
          style={styles.form}>
          <KeyboardAvoidingView
            behavior="position"
            style={{flex: 1}}
            keyboardVerticalOffset={Platform.OS == 'android' ? 200 : 0}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.0)']}
              style={styles.gradient}>
              <Text h1 bold style={{marginTop: 10 * BW()}}>
                {t('login')}
              </Text>
              <View style={styles.underline} />
              <Input
                textInput
                styleText={styles.styleText}
                label={t('userName')}
                viewStyle={styles.emailStyle}
                styleInput={styles.styleInput}
                value={email}
                onChangeText={setEmail}
              />
              <View style={{marginTop: 8 * BW()}}>
                <Text h4 style={{color: colors.darkBorder + 'bb'}}>
                  {t('password')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: colors.background,
                    alignItems: 'center',
                    borderRadius: 10 * BW(),
                    borderColor: colors.border,
                    borderWidth: 0.8 * BW(),
                    marginTop: 8 * BW(),
                  }}>
                  <Input
                    textInput
                    styleText={styles.styleText}
                    // label={t('password')}
                    viewStyle={styles.passStyle}
                    styleInput={styles.stylePassInput}
                    value={password}
                    secureTextEntry={showPassword}
                    onChangeText={setPassword}
                  />

                  <Button
                    style={styles.passShow}
                    styleIcon={styles.styleIconEye}
                    onPress={() => setShowPassword(!showPassword)}
                    icon={
                      showPassword
                        ? require('../../assets/icons/eye.png')
                        : require('../../assets/icons/hideEye.png')
                    }
                  />
                </View>
              </View>

              <Button
                h4
                style={styles.forgetPass}
                title={t('forgotPassword')}
                // onPress={() => NavigationService.navigate('Forgetpass', params)}
                onPress={() =>
                  NavigationService.navigate('WebViewScreen', {
                    url: `${getBaseURL()}/web/reset_password`,
                    withoutSession: true,
                  })
                }
              />
              <Button
                title={t('login')}
                style={styles.btnSubmit}
                h3
                disabled={isLogging}
                styleText={{color: '#fff'}}
                onPress={() => _login()}
                loading={isLogging}
              />

              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <Text h4> {t('noAccount')}</Text>
                <Button
                  h4
                  styleText={{color: colors.golden}}
                  style={styles.signUp}
                  title={t('newAccount')}
                  onPress={() =>
                    NavigationService.navigate('CustomerSignup', params)
                  }
                />
              </View>
              {Platform.OS == 'ios' && (
                <>
                  <View style={styles.or}>
                    <View style={styles.halfLine} />
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text h3> {t('or')}</Text>
                    </View>
                    <View style={styles.halfLine} />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <AppleSignIn colors={colors} />
                  </View>
                </>
              )}
            </LinearGradient>
          </KeyboardAvoidingView>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const getStyle = (colors: any, width: number, height: number) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      height: '100%',
    },

    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    form: {
      marginTop: -120 * BW(),
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
      width: 30 * BW(),
      backgroundColor: colors.golden,
      marginTop: 2,
    },
    btnSubmit: {
      backgroundColor: colors.primary,
      height: 'auto',
      paddingVertical: 8 * BW(),
      minHeight: 45 * BW(),
      paddingHorizontal: 40 * BW(),
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16 * BW(),
    },
    emailStyle: {
      width: '100%',
      marginTop: 40 * BW(),
    },
    passStyle: {
      marginTop: 0 * BW(),
      flex: 1,
    },
    styleInput: {
      backgroundColor: colors.background,
      width: '100%',
      paddingVertical: 10 * BW(),
      paddingHorizontal: 10 * BW(),
      marginTop: 8 * BW(),
      borderRadius: 10 * BW(),
      borderWidth: 0.8 * BW(),
      borderColor: colors.border,
    },
    stylePassInput: {
      backgroundColor: colors.background,
      width: '100%',
      paddingVertical: 10 * BW(),
      paddingHorizontal: 10 * BW(),
      marginTop: 0 * BW(),
      borderRadius: 10 * BW(),
      borderColor: colors.border,
      borderWidth: 0 * BW(),
      borderBottomWidth: 0.4 * BW(),
    },
    styleText: {
      color: colors.darkBorder + 'bb',
    },
    containerBackStyle: {
      right: 10 * BW(),
      position: 'absolute',
      zIndex: 99,
      top: 10 * BW(),
    },
    backStyle: {
      width: 'auto',
      height: 'auto',
      backgroundColor: 'rgba(0,0,0,0.07)',
      zIndex: 99,
      padding: 5 * BW(),
      borderRadius: 44 * BW(),
    },
    styleIconBack: {
      tintColor: colors.primary,
      width: 20 * BW(),
      height: 20 * BW(),
    },
    passShow: {
      width: 'auto',
      height: 'auto',
      backgroundColor: colors.background,
      borderRadius: 8 * BW(),
      marginTop: 2 * BW(),
      padding: 0,
      right: 5 * BW(),
    },
    styleIconEye: {
      tintColor: colors.golden,
      width: '70%',
      height: '70%',
    },
    forgetPass: {
      width: 'auto',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      marginTop: 8 * BW(),
    },
    signUp: {
      width: 'auto',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      marginLeft: 8 * BW(),
    },
    uaePass: {
      width: '100%',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      marginTop: 8 * BW(),
      marginBottom: 8 * BW(),
    },
    uaePassIcon: {
      width: '100%',
      height: 48 * BW(),
    },
    halfLine: {
      flex: 2,
      borderWidth: 0.5 * BW(),
      borderColor: colors.primary + '88',
      height: 0,
    },
    or: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16 * BW(),
    },
    guest: {
      alignSelf: 'center',
      height: 'auto',
      borderWidth: 1 * BW(),
      width: '100%',
      paddingVertical: 8 * BW(),
      paddingHorizontal: 10 * BW(),
      marginTop: 12 * BW(),
      borderRadius: 20 * BW(),
      borderColor: colors.primary,
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginVertical: 8 * BW(),
    },
    logoContainer: {
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });
