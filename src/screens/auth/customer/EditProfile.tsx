import React, {useEffect, useRef, useState} from 'react';
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
import {Formik} from 'formik';
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
import {getprofileData} from '../../../redux/reducers/User/thunk/profile';
import {editProfileThunk} from '../../../redux/reducers/User/thunk/editProfile';

function EditProfile(props: any): JSX.Element {
  const phoneNumber = props?.route?.params?.phoneNumber;
  const {colors} = useTheme();
  const generalStyles = getGeneralStyle(colors);
  const styles = getStyles(colors, generalStyles);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [sendOtp, setsendOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [countryCode, setCountryCode] = useState('');
  const [cellCount, setCellCount] = useState(6);
  const [otpSecret, setOtpSecret] = useState(6);
  const {countries, states, areas} = useAppSelector(state => state.user.signUp);
  const phoneInput = useRef<PhoneInput>(null);
  const [call, setCall] = useState(false);
  const {loading} = useAppSelector(state => state.loader);
  const [loader, setLoader] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [otpValue, setOtpValue] = useState(null);
  const {authenticatedUser} = useAppSelector(state => state.auth);
  const [initialValues, setInitialValues] = useState({});
  const [customNumber, setCustomNumber] = useState(
    !!phoneNumber ? phoneNumber?.replace(/^(?:\+?971|[+])|,/g, '') : '',
  );
  const [valueObj, setValueObj] = useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    country: '',
    area: '',
    emirate: '',
    street: '',
    building: '',
    moreInfo: '',
  });

  useEffect(() => {
    if (userInfo) {
      setValueObj({
        email: userInfo.email || '',
        phoneNumber: userInfo.mobile || '',
        firstName: userInfo.first_name || '',
        lastName: userInfo.last_name || '',
        country: userInfo.country_id || '',
        area: userInfo.area_id || '',
        emirate: userInfo.state_id || '',
        street: userInfo.street || '',
        building: userInfo.building || '',
        moreInfo: userInfo.user_more_information || '',
      });
    }
  }, [userInfo]);

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
    setOtpValue(value);
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
          setIsOtpVerified(true);
          const data = {
            name: `${otpValue.firstName} ${otpValue.lastName}`,
            email: otpValue.email,
            mobile: otpValue.phoneNumber,
            country_id: otpValue.country,
            area_id: otpValue.area,
            state_id: otpValue.emirate,
            street: otpValue.street,
            user_street: otpValue.street,
            building: otpValue.building,
            user_more_information: otpValue.moreInfo,
          };
          _editProfileThunk(data);
          setValueObj(otpValue);
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

  const _signupDataThunk = () => {
    dispatch(
      signupDataThunk({
        emirates: true,
      }),
    );
  };

  useEffect(() => {
    setCall(true);
  }, []);

  useEffect(() => {
    if (call) {
      _signupDataThunk();
    }
  }, [call]);

  const _getProfile = () => {
    setLoader(true);
    dispatch(
      getprofileData({
        userId: authenticatedUser,
      }),
    ).then(res => {
      setLoader(false);
      if (res?.payload?.result && res?.payload?.result?.data) {
        setUserInfo(res?.payload?.result?.data);
      } else {
        // _setModalData(t('cantEdit'), t('sorry'));
      }
    });
  };

  useEffect(() => {
    _getProfile();
  }, []);

  const getProfileSchema = () => {
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
      emirate: Yup.string().required(t('required')),
      area: Yup.string().required(t('required')),
      street: Yup.string().required(t('required')),
      building: Yup.string().required(t('required')),
      moreInfo: Yup.string().required(t('required')),
    };

    return Yup.object().shape(baseSchema);
  };
  const ProfileSchema = getProfileSchema();

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      const nameParts = userInfo?.name?.split(' ');
      const _firstName = nameParts[0];
      const _lastName = nameParts.slice(1).join(' ');
      const initialEditValues = {
        firstName: _firstName || '',
        lastName: _lastName || '',
        phoneNumber: userInfo?.mobile || '',
        email: userInfo?.email || '',
        country: userInfo?.country_id[0] || '',
        emirate: userInfo?.state_id[0] || '',
        area: userInfo?.area_id[0] || '',
        street: userInfo?.street || '',
        building: userInfo?.building || '',
        moreInfo: userInfo?.extra_location_information || '',
      };
      setInitialValues(initialEditValues);
    }
  }, [userInfo]);

  const _editProfileThunk = (data: any) => {
    dispatch(editProfileThunk({user_id: authenticatedUser, ...data})).then(
      res => {
        if (
          res.payload?.result?.status &&
          res.payload?.result?.status == 'success'
        ) {
          dispatch(
            setAuthValues({
              userName: res?.payload?.result?.data?.name.toString(),
            }),
          );
          NavigationService.navigate('Profile', {});
        } else if (
          res.payload?.result?.status &&
          res.payload?.result?.status == 'failure' &&
          res.payload?.result?.type == 'mobileExist'
        ) {
          _setModalData(t('mobileExist'));
        } else {
          _setModalData(t('cantSave'));
        }
      },
    );
  };
  const _submit = (value: any) => {
    // const isEmailChanged = value.email !== valueObj.email;
    const isPhoneChanged = value.phoneNumber !== valueObj.phoneNumber;

    if (isPhoneChanged) {
      setOtpValue(value);
      _sendOtp(value);
    } else {
      const data = {
        name: `${value.firstName} ${value.lastName}`,
        email: value.email,
        mobile: value.phoneNumber,
        country_id: value.country,
        area_id: value.area,
        state_id: value.emirate,
        street: value.street,
        user_street: value.street,
        building: value.building,
        user_more_information: value.moreInfo,
      };
      _editProfileThunk(data);
      setValueObj(value);
    }
  };

  return (
    <View style={styles.appContainer}>
      <Header
        hideDrawer
        hideNotification
        titleCenter
        title={t('editProfile')}
        hideTitle
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.container}>
        <Loader isLoading={loader}>
          <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={ProfileSchema}
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
              }) => (
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
                            onPress={() => {
                              _sendOtp(values);
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
                        requiredStar
                        error={
                          errors.email && touched.email ? errors.email : null
                        }
                        disabled
                      />
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
                        error={errors.area && touched.area ? errors.area : null}
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
                    title={sendOtp ? t('check') : t('submit')}
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
              )}
            </Formik>
          </ScrollView>
        </Loader>
      </KeyboardAvoidingView>
    </View>
  );
  //   return (
  // <View
  //   style={{
  //     flex: 1,
  //     backgroundColor: 'pink',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   }}>
  //   <Text h2 bold style={{color: '#fff'}}>
  //     Edit Profile
  //   </Text>
  // </View>

  //   );
}
export default EditProfile;

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
