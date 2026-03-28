import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Formik, useFormikContext} from 'formik';
import * as Yup from 'yup';

import Header from '../../../component/Header';
import {BW} from '../../../style/theme';
import Text from '../../../component/Text';
import {
  detectLocation,
  requestLocation,
} from '../../../component/Generalfunction';
import Input from '../../../component/Input';
import Button from '../../../component/Button';
import {getGeneralStyle} from '../../../style/styles';
import PhoneInput from 'react-native-phone-number-input';
import {
  signupThunk,
  signupDataThunk,
  signupAppleThunk,
} from '../../../redux/reducers/User/thunk/signup';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import OTPCustom from '../../../component/Otp';
import {setModalData} from '../../../redux/reducers/modal';
import {checkOtpApi, sendOtpApi} from '../../../redux/reducers/Otp/thunk/otp';
import {checkExistThunk} from '../../../redux/reducers/User/thunk/checkExist';
import reactotron from '../../../redux/reactotron';
import Loader from '../../../component/Loader';
import {setAuthValues} from '../../../redux/reducers/User/startup';
import NavigationService from '../../../naigation/NavigationService';
import MyLocation from '../../../component/Location';
import {cheackServiceAvailabilty} from '../../../redux/reducers/User/thunk/signup';
import appsFlyer from 'react-native-appsflyer';
export default function CustomerSignup(props: any) {
  let params = props.route?.params;
  const {colors} = useTheme();
  const generalStyles = getGeneralStyle(colors);
  const dispatch = useAppDispatch();
  const styles = getStyles(colors, generalStyles);
  const phoneInput = useRef<PhoneInput>(null);
  const {t} = useTranslation();
  const [position, setPosition] = useState({});
  const [address, setAddress] = useState();
  const [hidePass, setHidePass] = useState(true);
  const [valueObj, setValue] = useState({});
  const [customNumber, setCustomNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [sendOtp, setsendOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [cellCount, setCellCount] = useState(6);
  const [otpSecret, setOtpSecret] = useState(6);
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [hideConfirmPass, setHideConfirmPass] = useState(true);
  const {countries, states, areas, isMap, emirateOnly} = useAppSelector(
    state => state.user.signUp,
  );
  const {loading} = useAppSelector(state => state.loader);
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    address: '',
  });
  const [cheackAvailability, setCheackAvailability] = useState(false);

  // otp
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
            mobile_number: `+${countryCode}${customNumber}`,
            email: value.email,
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
          _signup(valueObj);
        } else {
          _setModalData(t('tryAgain'));
        }
      });
    }
  };
  const _setModalData = (error: string) => {
    dispatch(
      setModalData({
        modalVisible: true,
        title: t('sorry'),
        message: error,
      }),
    );
  };

  useEffect(() => {
    _checkOtp();
  }, [otp]);

  // location
  useFocusEffect(() => {
    if (!position?.latitude) {
      detectLocation().then(response => {
        setPosition(response);

        getAddress(response);
      });
    }
  });

  const _signupDataThunk = () => {
    dispatch(
      signupDataThunk({
        emirates: true,
      }),
    );
  };
  useEffect(() => {
    _signupDataThunk();
  }, []);

  // location
  const getAddress = position => {
    requestLocation({
      latitude: position?.latitude,
      longitude: position?.longitude,
    }).then(res => setAddress(res?.formatted_address));
  };

  const getSignupSchema = () => {
    const baseSchema = {
      firstName: Yup.string().required(t('required')),
      lastName: Yup.string().required(t('required')),
      phoneNumber: Yup.string()
        .required(t('required'))
        .test('isValidPhone', 'invalidPhone', function (value) {
          const {path, createError} = this;
          const isValid = phoneInput.current?.isValidNumber(value);
          return isValid || createError({path, message: t('invalidNumber')});
        }),
      email: Yup.string().email(t('invalidEmail')).required(t('required')),
      country: Yup.string().required(t('required')),
      ...(isMap
        ? {
            shipping_latitude: Yup.number().required(t('required')),
            shipping_longitude: Yup.number().required(t('required')),
            shipping_address: Yup.string().required(t('required')),
          }
        : {
            emirate: Yup.string().required(t('required')),
            area: Yup.string().required(t('required')),
            street: Yup.string().required(t('required')),
            building: Yup.string().required(t('required')),
            moreInfo: Yup.string().required(t('required')),
          }),
    };

    if (!!!params?.withData) {
      baseSchema.password = Yup.string()
        .required(t('required'))
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.{8,})/,
          t('passwordCondition'),
        );
      baseSchema.confirmPassword = Yup.string()
        .required(t('required'))
        .oneOf([Yup.ref('password')], t('passwordMatch'));
    }

    return Yup.object().shape(baseSchema);
  };
  const SignupSchema = getSignupSchema();

  // check exist
  const _checkExistThunk = (value: any) => {
    dispatch(
      checkExistThunk({
        payload: {
          data: {
            email: value.email,
            mobile: `+${countryCode},${customNumber}`,
          },
        },
      }),
    ).then(res => {
      if (res.payload.result?.success) {
        if (params?.withData) {
          _signup(value);
        } else if (isMap) {
          dispatch(
            cheackServiceAvailabilty({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            }),
          ).then(res => {
            setCheackAvailability(true);
            if (res?.payload?.result?.in_service) {
              _sendOtp(value);
            } else {
              _setModalData(res?.payload?.result?.msg);
            }
          });
          // _sendOtp(value);
        } else {
          setCheackAvailability(true);
          _sendOtp(value);
        }
      } else {
        //error
        _setModalData(t(res.payload.result?.msg));
      }
    });
  };

  const handleLocationChange = value => {
    setLocationData(prevState => ({
      ...prevState,
      address: String(value),
    }));
  };

  const handleCoordinatesChange = coordinates => {
    setLocationData(prevState => ({
      ...prevState,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    }));
  };
  const _submit = (value: any) => {
    if (params?.withData) {
      _checkExistThunk(value);
    } else {
      if (sendOtp) {
        _checkOtp();
      } else {
        setValue(value);
        _checkExistThunk(value);
      }
    }
  };

  // sigin up
  const _signup = (value: any) => {
    let data = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      mobile: `${countryCode},${customNumber}`,
      password: value.password,
      confirm_password: value.confirmPassword,
      user_country_id: value.country,
      form_mobile: 'mobile',
      continue: 'CONTINUE',
      ...(isMap
        ? {
            shipping_latitude: value.shipping_latitude,
            shipping_longitude: value.shipping_longitude,
            shipping_address: value?.shipping_address,
          }
        : {
            user_state_id: value.emirate,
            user_area_id: value.area,
            user_building: value.building,
            user_more_information: value.moreInfo,
            street: value.street,
            user_street: value.street,
          }),
    };
    if (!!params?.withData) {
      data.identityToken = params?.identityToken;
    }
    dispatch(
      !!params?.withData ? signupAppleThunk({data}) : signupThunk({data}),
    ).then(res => {
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
        NavigationService.navigate('Profile', {});
        appsFlyer.logEvent(
          'sign_up',
          {
            method: params?.withData ? 'apple' : 'email',
            user_id: res?.payload?.result?.data?.user_id,
          },
          result => console.log('Appsflyer signup event logged:', result),
          error => console.error('Appsflyer signup event error:', error),
        );
      } else if (
        !res?.payload?.result?.in_service &&
        !res?.payload?.result?.success
      ) {
        _setModalData(res?.payload?.result?.message);
      } else {
        _setModalData(res?.payload?.result?.msg);
      }
    });
  };

  const handleCountrySelect = country => {
    if (emirateOnly && country.cca2 !== 'AE') {
      phoneInput?.current?.setState({countryCode: 'AE'});
      setCountryCode('971');
    } else {
      phoneInput?.current?.setState({countryCode: country?.cca2});
      setCountryCode(country?.callingCode);
    }
  };

  return (
    <View style={styles.appContainer}>
      <Header
        hideDrawer
        hideNotification
        titleCenter
        title={t('signUp')}
        hideTitle
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.container}>
        <Loader isLoading={loading}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Formik
              initialValues={{
                firstName: params?.fullName?.givenName
                  ? params?.fullName?.givenName
                  : valueObj?.firstName,
                lastName: params?.fullName?.familyName
                  ? params?.fullName?.familyName
                  : valueObj?.lastName,
                phoneNumber: valueObj?.phoneNumber,
                email: params?.email ? params?.email : valueObj?.email,
                password: valueObj?.password,
                confirmPassword: valueObj?.confirmPassword,
                country: valueObj?.country,
                ...(isMap
                  ? {
                      shipping_latitude: valueObj?.latitude,
                      shipping_longitude: valueObj?.longitude,
                      shipping_address: valueObj?.address,
                    }
                  : {
                      emirate: valueObj?.emirate,
                      area: valueObj?.area,
                      street: valueObj?.street,
                      building: valueObj?.building,
                      moreInfo: valueObj?.moreInfo,
                    }),
              }}
              validationSchema={getSignupSchema}
              onSubmit={values => {
                _submit(values);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => {
                return (
                  <View style={styles.container}>
                    {sendOtp && cheackAvailability ? (
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
                              onPress={() => {
                                _sendOtp(valueObj);
                              }}
                            />
                          )}
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Input
                          textInput
                          label={t('firstName')}
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          value={values.firstName}
                          requiredStar
                          error={
                            errors.firstName && touched.firstName
                              ? errors.firstName
                              : null
                          }
                        />

                        <Input
                          textInput
                          label={t('lastName')}
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          value={values.lastName}
                          requiredStar
                          error={
                            errors.lastName && touched.lastName
                              ? errors.lastName
                              : null
                          }
                        />

                        <Input
                          phoneInputType
                          phoneInput={phoneInput}
                          label={t('phoneNumber')}
                          name={'phoneNumber'}
                          setFieldValue={setFieldValue}
                          setCustomNumber={setCustomNumber}
                          setCountryCode={setCountryCode}
                          onBlur={handleBlur('phoneNumber')}
                          value={customNumber}
                          countryPickerProps={{onSelect: handleCountrySelect}}
                          requiredStar
                          error={errors.phoneNumber ? errors.phoneNumber : null}
                        />

                        <Input
                          textInput
                          label={t('email')}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          keyboardType="email-address"
                          disabled={params?.withData && params?.email}
                          requiredStar
                          error={
                            errors.email && touched.email ? errors.email : null
                          }
                        />
                        {!!!params?.withData && (
                          <>
                            <View>
                              <Input
                                label={t('password')}
                                textInput
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePass ? true : false}
                                requiredStar
                                error={
                                  errors.password && touched.password
                                    ? errors.password
                                    : null
                                }
                              />
                              <Button
                                style={styles.passShow}
                                styleIcon={styles.styleIconEye}
                                onPress={() => setHidePass(!hidePass)}
                                icon={
                                  hidePass
                                    ? require('../../../assets/icons/eye.png')
                                    : require('../../../assets/icons/hideEye.png')
                                }
                              />
                            </View>
                            <View>
                              <Input
                                label={t('confirmPassword')}
                                textInput
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={hideConfirmPass ? true : false}
                                requiredStar
                                error={
                                  errors.confirmPassword &&
                                  touched.confirmPassword
                                    ? errors.confirmPassword
                                    : null
                                }
                              />
                              <Button
                                style={styles.passShow}
                                styleIcon={styles.styleIconEye}
                                onPress={() =>
                                  setHideConfirmPass(!hideConfirmPass)
                                }
                                icon={
                                  hideConfirmPass
                                    ? require('../../../assets/icons/eye.png')
                                    : require('../../../assets/icons/hideEye.png')
                                }
                              />
                            </View>
                          </>
                        )}
                        <Input
                          label={t('country')}
                          dropdown
                          items={countries}
                          onChangeValue={(item: any) =>
                            setFieldValue('country', item.id)
                          }
                          onBlur={() => handleBlur('country')}
                          placeholder={t('choose')}
                          requiredStar
                          error={
                            errors.country && touched.country
                              ? errors.country
                              : null
                          }
                          labelField="name"
                          valueField="id"
                          value={values.country}
                        />
                        {isMap ? (
                          <MyLocation
                            styleContainer={{
                              marginTop: 11 * BW(),
                            }}
                            style={{
                              padding: 6 * BW(),
                              minHeight: 40 * BW(),
                              borderWidth: 0.8 * BW(),
                              paddingHorizontal: 8 * BW(),
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                              borderRadius: 8 * BW(),
                              marginVertical: 10 * BW(),
                              flexDirection: 'row-reverse',
                              justifyContent: 'space-between',
                              flex: 1,
                              lineHeight: 20 * BW(),
                            }}
                            label={'Location'}
                            styleLabel={{
                              color: colors.text,
                            }}
                            redStar
                            styleInput={{
                              borderRadius: 10 * BW(),
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                            }}
                            press={true}
                            is_expand={true}
                            setLocationProps={value => {
                              setFieldValue('shipping_address', String(value));
                              handleLocationChange(value);
                            }}
                            styleAddress={{marginLeft: 0, flex: 1}}
                            onCoordinatesChange={coordinates => {
                              setFieldValue(
                                'shipping_latitude',
                                coordinates?.latitude,
                              );
                              setFieldValue(
                                'shipping_longitude',
                                coordinates?.longitude,
                              );
                              handleCoordinatesChange(coordinates);
                            }}
                          />
                        ) : (
                          <>
                            <Input
                              label={t('emirate')}
                              dropdown
                              search
                              items={states}
                              onChangeValue={(item: any) =>
                                setFieldValue('emirate', item.id)
                              }
                              onBlur={() => handleBlur('emirate')}
                              placeholder={t('choose')}
                              requiredStar
                              error={
                                errors.emirate && touched.emirate
                                  ? errors.emirate
                                  : null
                              }
                              labelField="name"
                              valueField="id"
                              value={values.emirate}
                            />
                            <Input
                              label={t('area')}
                              dropdown
                              search
                              value={values.area}
                              items={areas?.filter(
                                p => p?.state_id[0] == values.emirate,
                              )}
                              onChangeValue={(item: any) =>
                                setFieldValue('area', item.id)
                              }
                              onBlur={() => handleBlur('area')}
                              placeholder={t('area')}
                              requiredStar
                              error={
                                errors.area && touched.area ? errors.area : null
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
                                errors.street && touched.street
                                  ? errors.street
                                  : null
                              }
                            />

                            <Input
                              textInput
                              label={t('building')}
                              onChangeText={handleChange('building')}
                              onBlur={handleBlur('building')}
                              value={values.building}
                              requiredStar
                              error={
                                errors.building && touched.building
                                  ? errors.building
                                  : null
                              }
                              placeholder={t('buildingNumber')}
                            />
                            <Input
                              textInput
                              label={t('moreInfo')}
                              onChangeText={handleChange('moreInfo')}
                              onBlur={handleBlur('moreInfo')}
                              value={values.moreInfo}
                              requiredStar
                              error={
                                errors.moreInfo && touched.moreInfo
                                  ? errors.moreInfo
                                  : null
                              }
                              placeholder={t('floor-appartment-office')}
                            />
                          </>
                        )}

                        {errors && Object.keys(errors).length != 0 ? (
                          <View style={{marginTop: 10 * BW()}}>
                            <Text h5 style={generalStyles.error}>
                              {t('ERRORVALID')}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    )}
                    <Button
                      title={
                        sendOtp && cheackAvailability ? t('check') : t('submit')
                      }
                      style={styles.btnSubmit}
                      // loading={resetPasswordLoader || otpLoader || dataLoader}
                      disabled={
                        (errors && Object.keys(errors).length != 0) ||
                        (sendOtp && otp.length < cellCount)
                      }
                      h3
                      styleText={{color: '#fff'}}
                      onPress={handleSubmit}
                    />
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </Loader>
      </KeyboardAvoidingView>
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
    passShow: {
      width: 'auto',
      height: 'auto',
      position: 'absolute',
      right: 5 * BW(),
      top: 42 * BW(),
      padding: 0,
      backgroundColor: 'transparent',
    },
    styleIconEye: {
      tintColor: colors.primary + '99',
      width: '70%',
      height: '70%',
    },
    btnSubmit: {
      ...generalStyles.btnSubmit,
    },
    renderItem: {
      paddingHorizontal: 10 * BW(),
      paddingVertical: 8 * BW(),
      backgroundColor: colors.backgroundColorInput,
      color: colors.text,
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

let aa = {
  user: '000337.a1a4ff8f69b74331a768978a5b8abc92.0424',
  email: 'bashar.sy@gmail.com',
  nonce: 'jKZN_KEa0EHLDxiO_n.TMAlh20emtvxt',
  state: null,
  fullName: {
    nickname: null,
    givenName: 'Bashar',
    familyName: 'Ahmad',
    middleName: null,
    namePrefix: null,
    nameSuffix: null,
  },
  identityToken:
    'eyJraWQiOiJUOHRJSjF6U3JPIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1hcmtldHBsYWNlYXBwLnNlZW5zaG9wcGluZyIsImV4cCI6MTcxOTI4OTQ4MiwiaWF0IjoxNzE5MjAzMDgyLCJzdWIiOiIwMDAzMzcuYTFhNGZmOGY2OWI3NDMzMWE3Njg5NzhhNWI4YWJjOTIuMDQyNCIsIm5vbmNlIjoiNjlhNjE2OGZiOTkxZWFhMjFhYTY3Y2ViNTVjNTcxMjVjMGFjMzUzODI5ODJjOTg0YTEzZDYxNTc4ZmMyMjAxNSIsImNfaGFzaCI6IjNTWUpESzNwcGFOOW55QnhxVEVoMHciLCJlbWFpbCI6ImJhc2hhci5zeUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXV0aF90aW1lIjoxNzE5MjAzMDgyLCJub25jZV9zdXBwb3J0ZWQiOnRydWUsInJlYWxfdXNlcl9zdGF0dXMiOjJ9.foDKvk4UbhbWU25Wpu2WtjbCp9_dENG9tfUoO7vGUrBZiX0M8LNxz2-us_GjD8d0qky73IKExzLMEuNYRwlsSOjttqafzRHmkv9Isulw7YsLrpYlIxX6lfIe96cP8aM_KJEraXVqzLpKJ87sWfye4kPZ8TihFdBNZAjkmhsIhV4R30lJvNkG2OwoGDoAPEb5kslNOIX7U4mA-jq2uyWpu2wPhtK0lcG-Xl4_2QbekCh3LTEXQ7172X-wovVmDIdeycjLlyg-vBRS6pKtnkWhhVEV-bu9Ji2P1idurMXaaPCf79aAbJ6UmtvlNy1gY2AqndJU0hX5vUNQwhxHkXd20g',
  realUserStatus: 2,
  authorizedScopes: [],
  authorizationCode:
    'c2b3fa217e5ef4187a0e4a28ed3a92b84.0.rttx.j0KmUbaKrGZfF1zrpqhnsA',
};
