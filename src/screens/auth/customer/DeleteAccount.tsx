import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Header from '../../../component/Header';
import {BW} from '../../../style/theme';
import Text from '../../../component/Text';
import Input from '../../../component/Input';
import Button from '../../../component/Button';
import {getGeneralStyle} from '../../../style/styles';
import OTPCustom from '../../../component/Otp';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {setModalData} from '../../../redux/reducers/modal';
import {checkOtpApi, sendOtpApi} from '../../../redux/reducers/Otp/thunk/otp';
import Loader from '../../../component/Loader';
import {deleteAccountThunk} from '../../../redux/reducers/User/thunk/deleteAccount';
import NavigationService from '../../../naigation/NavigationService';
import {useTranslation} from 'react-i18next';

export default function DeleteAccount(props: any) {
  const {colors} = useTheme();
  const generalStyles = getGeneralStyle(colors);
  const dispatch = useAppDispatch();
  const styles = getStyles(colors, generalStyles);

  const {t} = useTranslation();
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [cellCount, setCellCount] = useState(6);
  const [otpSecret, setOtpSecret] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const {profileData, dataLoader: profileDataLoader} = useAppSelector(
    state => state.profile,
  );
  const {loading} = useAppSelector(state => state.loader);
  const {authenticatedUser} = useAppSelector(state => state.auth);

  useEffect(() => {
    setOtp('');
    setSendOtp(false);
    setOtpSecret('');
  }, []);

  // otp
  const resendTimer = () => {
    setOtp('');
    setShowTimer(true);
    setTimeRemaining(60);
  };

  useEffect(() => {
    let timer: number;
    if (showTimer) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => (prevTime == 0 ? 0 : prevTime - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  const _sendOtp = () => {
    resendTimer();
    dispatch(
      sendOtpApi({
        payload: {
          data: {
            mobile_number: profileData.mobile,
            email: profileData.email,
          },
        },
      }),
    ).then(res => {
      if (res.payload.result?.success) {
        setCellCount(parseInt(res.payload.result?.number_of_digits));
        setOtpSecret(res.payload.result?.otp_secret);
        setSendOtp(true);
      } else {
        //error
        _setModalData(t('tryAgain'), t('sorry'));
      }
    });
  };

  const _setModalData = (error: string, title?: string) => {
    dispatch(
      setModalData({
        modalVisible: true,
        title: title,
        message: error,
      }),
    );
  };

  useEffect(() => {
    _deleteAccount();
  }, [otp]);

  const _deleteAccount = () => {
    if (!!otp && otp.length == cellCount) {
      dispatch(
        deleteAccountThunk({
          data: {
            otp_secret: otpSecret,
            otp_token: otp,
            user_id: authenticatedUser,
          },
        }),
      ).then(res => {
        if (
          res.meta.requestStatus == 'fulfilled' &&
          res?.payload?.result?.success
        ) {
          _setModalData(res?.payload?.result?.message);
          NavigationService.reset('Home', {});
          setOtp('');
        } else {
          _setModalData(
            res?.payload?.result?.message || t('tryAgain'),
            t('sorry'),
          );
        }
      });
    }
  };

  return (
    <View style={styles.appContainer}>
      <Header
        hideDrawer
        hideNotification
        titleCenter
        title={t('DeleteAccount')}
        hideTitle
      />
      <Loader>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'height' : 'height'}
          style={styles.container}>
          <Loader isLoading={profileDataLoader}>
            <ScrollView
              automaticallyAdjustKeyboardInsets={true}
              showsVerticalScrollIndicator={false}>
              <Formik
                initialValues={{}}
                validationSchema={Yup.object({})}
                onSubmit={() => {
                  if (sendOtp) {
                    _deleteAccount();
                  } else {
                    _sendOtp();
                  }
                }}>
                {({handleSubmit}) => (
                  <View style={styles.container}>
                    {sendOtp ? (
                      <View style={{marginTop: 20 * BW()}}>
                        <Text h4 justify style={{marginBottom: 12 * BW()}}>
                          {t('sendedOTP')}
                        </Text>
                        <OTPCustom
                          otp={otp}
                          setOtp={setOtp}
                          setOtpOtp={setOtp}
                          cellCount={cellCount}
                        />
                        <View
                          style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginTop: -4 * BW(),
                            marginBottom: 15 * BW(),
                          }}>
                          <Text h4>
                            {t('didntRecevicOtp')}
                            {timeRemaining != 0 && formatTime(timeRemaining)}
                          </Text>
                          {timeRemaining == 0 && (
                            <Button
                              styleText={{color: colors.primary}}
                              style={styles.resend}
                              title={t('resend')}
                              onPress={_sendOtp}
                            />
                          )}
                        </View>
                      </View>
                    ) : (
                      <View style={{marginTop: 20 * BW()}}>
                        <Text h4 justify style={{marginBottom: 12 * BW()}}>
                          {t('confirmDeleteAccount')}
                        </Text>
                      </View>
                    )}
                    <Button
                      title={sendOtp ? t('check') : t('sendOTP')}
                      style={styles.btnSubmit}
                      disabled={sendOtp && otp.length < cellCount}
                      h4
                      styleText={{color: '#fff'}}
                      onPress={handleSubmit}
                    />
                  </View>
                )}
              </Formik>
            </ScrollView>
          </Loader>
        </KeyboardAvoidingView>
      </Loader>
    </View>
  );
}

const getStyles = (colors: any, generalStyles: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 8 * BW(),
      paddingBottom: 8 * BW(),
    },
    btnSubmit: {
      ...generalStyles.btnSubmit,
    },
    resend: {
      width: 'auto',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      alignSelf: 'center',
      borderBottomColor: colors.primary,
      borderBottomWidth: 1 * BW(),
      borderRadius: 0,
      marginLeft: 6 * BW(),
    },
  });
