import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { getBaseURL } from '../../redux/network/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import Text from '../../component/Text';

import { setModalData } from '../../redux/reducers/modal';

import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';

import Input from '../../component/Input';

import { getGeneralStyle } from '../../style/styles';

import { getCheckOut } from '../../redux/reducers/cart/thunk/checkOut';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { signupDataThunk } from '../../redux/reducers/User/thunk/signup';
import PhoneInput from 'react-native-phone-number-input';
import { setAuthValues } from '../../redux/reducers/User/startup';
import { setSessionUserValues } from '../../redux/reducers/User/session';
import { checkOtpApi, sendOtpApi } from '../../redux/reducers/Otp/thunk/otp';
import OTPCustom from '../../component/Otp';
function GeustInfo(props: any): JSX.Element {
  const orderId = props?.route?.params?.orderId;
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const phoneInput = useRef<PhoneInput>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { countries, states, areas, isMap, emirateOnly } = useAppSelector(
    state => state.user.signUp,
  );
  const [countryCode, setCountryCode] = useState('971');
  const [customNumber, setCustomNumber] = useState('');
  const [sendOtp, setsendOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [cellCount, setCellCount] = useState(6);
  const [otpSecret, setOtpSecret] = useState(6);
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [valueObj, setValue] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const _setModalData = (msg: string, style?: any) => {
    dispatch(
      setModalData({
        modalVisible: true,
        message: msg,
        customStyle: style,
      }),
    );
  };

  const _signupDataThunk = () => {
    dispatch(
      signupDataThunk({
        emirates: true,
        only_delivery_areas: true,
      }),
    );
  };
  useEffect(() => {
    _signupDataThunk();
  }, []);

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .required(t('required'))
      .test('isValidPhone', 'invalidPhone', function (value) {
        const { path, createError } = this;
        const isValid = phoneInput.current?.isValidNumber(value);
        return isValid || createError({ path, message: t('invalidNumber') });
      }),
    country_id: Yup.number().required('Required'),
    state_id: Yup.number().required('Required'),
    area_id: Yup.number().required('Required'),
    street: Yup.string().required('Required'),
    more_info: Yup.string().required('Required'),
  });

  const handleSubmit = (values: any) => {
    _sendOtp(values);
    if (sendOtp) {
      setIsVerifying(true);
      _checkOtp();
    } else {
      setValue(values);
    }
  };

  useEffect(() => {
    setOtp('');
    setsendOtp(false);
  }, []);

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

  const _sendOtp = (value: any) => {
    resendTimer();
    dispatch(
      sendOtpApi({
        payload: {
          data: {
            mobile_number: `+${customNumber}`,
          },
        },
      }),
    ).then(res => {
      if (res.payload.result?.success) {
        setCellCount(parseInt(res.payload.result?.number_of_digits));
        setOtpSecret(res.payload.result?.otp_secret);
        setsendOtp(true);
      } else {
        //error
        _setModalData(t('tryAgain'));
      }
    });
  };

  const _signupGeust = (values: any) => {
    dispatch(
      getCheckOut({
        ...values,
        orderId,
      }),
    ).then(res => {
      if (res?.payload?.result?.success == true) {
        dispatch(
          setAuthValues({
            token: res?.payload?.result?.data?.token,
            authenticatedUser: res?.payload?.result?.data?.user_id,
            userName: res?.payload?.result?.data?.user_name,
          }),
        );
        dispatch(
          setSessionUserValues({
            session: res.payload?.result?.data?.session_token,
          }),
        );
        NavigationService.navigate('CheckOut', {
          orderId: orderId,
        });
        setIsVerifying(false);
      } else {
        setIsVerifying(false);
        _setModalData(t('tryAgain'));
      }
    });
  };

  const _checkOtp = () => {
    if (!!otp && otp.length == cellCount) {
      dispatch(
        checkOtpApi({
          payload: {
            data: {
              otp_secret: otpSecret,
              otp_token: otp,
            },
          },
        }),
      ).then(res => {
        if (res.payload.result?.success) {
          _signupGeust(valueObj);
        } else {
          setIsVerifying(false);
          _setModalData(t('tryAgain'));
        }
      });
    }
  };

  useEffect(() => {
    _checkOtp();
  }, [otp]);

  const handleCountrySelect = country => {
    if (emirateOnly && country.cca2 !== 'AE') {
      phoneInput?.current?.setState({ countryCode: 'AE' });
      setCountryCode('971');
    } else {
      phoneInput?.current?.setState({ countryCode: country?.cca2 });
      setCountryCode(country?.callingCode);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={false}>
        <Header hideDrawer title={t('guestInfo')} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        >
          <Formik
            initialValues={{
              mobile: '',
              country_id: '',
              email: '',
              name: '',
              state_id: '',
              area_id: '',
              street: '',
              more_info: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              setFieldValue,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.container}>
                {sendOtp ? (
                  <View style={{ marginTop: 20 * BW() }}>
                    <Text h4 justify style={{ marginBottom: 12 * BW() }}>
                      {t('sendedOTPPhone')}
                    </Text>
                    <OTPCustom
                      otp={otp}
                      setOtp={setOtp}
                      setOtpOtp={setOtp}
                      cellCount={cellCount}
                    />
                    <Text h4>
                      {timeRemaining != 0 && formatTime(timeRemaining)}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Input
                      phoneInputType
                      phoneInput={phoneInput}
                      label={t('mobile')}
                      name={'mobile'}
                      setFieldValue={setFieldValue}
                      setCustomNumber={setCustomNumber}
                      setCountryCode={setCountryCode}
                      onBlur={handleBlur('mobile')}
                      value={customNumber}
                      countryPickerProps={{ onSelect: handleCountrySelect }}
                      requiredStar
                      error={errors.mobile ? errors.mobile : null}
                    />
                    <Input
                      textInput
                      label={t('name')}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      error={errors.name && touched.name ? errors.name : null}
                    />
                    <Input
                      textInput
                      label={t('email')}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      error={
                        errors.email && touched.email ? errors.email : null
                      }
                    />

                    <Input
                      label={t('country')}
                      dropdown
                      items={countries}
                      onChangeValue={(item: any) =>
                        setFieldValue('country_id', item.id)
                      }
                      onBlur={() => handleBlur('country_id')}
                      placeholder={t('choose')}
                      requiredStar
                      error={
                        errors.country_id && touched.country_id
                          ? errors.country_id
                          : null
                      }
                      labelField="name"
                      valueField="id"
                      value={values.country_id}
                    />

                    <Input
                      label={t('emirate')}
                      dropdown
                      search
                      items={states}
                      onChangeValue={(item: any) =>
                        setFieldValue('state_id', item.id)
                      }
                      onBlur={() => handleBlur('state_id')}
                      placeholder={t('choose')}
                      requiredStar
                      error={
                        errors.state_id && touched.state_id
                          ? errors.state_id
                          : null
                      }
                      labelField="name"
                      valueField="id"
                      value={values.state_id}
                    />
                    <Input
                      label={t('area')}
                      dropdown
                      search
                      value={values.area_id}
                      items={areas?.filter(
                        p => p?.state_id[0] == values.state_id,
                      )}
                      onChangeValue={(item: any) =>
                        setFieldValue('area_id', item.id)
                      }
                      onBlur={() => handleBlur('area_id')}
                      placeholder={t('area')}
                      requiredStar
                      error={
                        errors.area_id && touched.area_id
                          ? errors.area_id
                          : null
                      }
                      labelField="region_name"
                      valueField="id"
                      renderItemProps={item => {
                        return (
                          <View style={styles.renderItem}>
                            <Text>{item?.region_name}</Text>
                          </View>
                        );
                      }}
                    />

                    <Input
                      textInput
                      label={t('street')}
                      onChangeText={handleChange('street')}
                      onBlur={handleBlur('street')}
                      value={values.street}
                      requiredStar
                      error={
                        errors.street && touched.street ? errors.street : null
                      }
                    />

                    <Input
                      textInput
                      label={t('moreInfo')}
                      onChangeText={handleChange('more_info')}
                      onBlur={handleBlur('more_info')}
                      value={values.more_info}
                      requiredStar
                      error={
                        errors.more_info && touched.more_info
                          ? errors.more_info
                          : null
                      }
                    />
                  </View>
                )}
                {sendOtp && (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: -4 * BW(),
                      marginBottom: 15 * BW(),
                    }}
                  >
                    <Text h4>{t('didntRecevicOtp')}</Text>
                    <Button
                      styleText={{ color: '#D4A86B' }}
                      style={styles.resend}
                      title={t('resend')}
                      onPress={() => {
                        _sendOtp(valueObj);
                      }}
                    />
                  </View>
                )}

                <Button
                  title={sendOtp ? t('Verify') : t('confirm')}
                  style={styles.addBtn}
                  styleText={{ color: '#fff' }}
                  disabled={
                    (errors && Object.keys(errors).length != 0) ||
                    (sendOtp && otp.length < cellCount)
                  }
                  loading={isVerifying}
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </Loader>
    </View>
  );
}
export default GeustInfo;

const getStyle = (colors: any) =>
  StyleSheet.create({
    addBtn: {
      backgroundColor: colors.primary,
      height: 'auto',
      marginVertical: 16 * BW(),
    },
    renderItem: {
      paddingHorizontal: 10 * BW(),
      paddingVertical: 8 * BW(),
      backgroundColor: colors.backgroundColorInput,
      color: colors.text,
    },
    container: {
      flex: 1,
      paddingHorizontal: 8 * BW(),
      paddingBottom: 8 * BW(),
    },
    resend: {
      width: 'auto',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      alignSelf: 'center',
      borderBottomColor: '#D4A86B',
      borderBottomWidth: 1 * BW(),
      borderRadius: 0,
      marginLeft: 6 * BW(),
    },
  });
