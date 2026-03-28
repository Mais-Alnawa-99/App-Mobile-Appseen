import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Header from '../../../component/Header';
import {BW} from '../../../style/theme';
import Text from '../../../component/Text';
import Input from '../../../component/Input';
import Button from '../../../component/Button';
import PhoneInput from 'react-native-phone-number-input';
import {signupDataThunk} from '../../../redux/reducers/User/thunk/signup';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {setModalData} from '../../../redux/reducers/modal';
import Loader from '../../../component/Loader';
import NavigationService from '../../../naigation/NavigationService';
import {getaddUserLocations} from '../../../redux/reducers/User/thunk/locations/addLocation';
import {getLocationInfo} from '../../../redux/reducers/User/thunk/locations/getLocInfo';
import MyLocation from '../../../component/Location';
import {LocalNotification} from '../../../pushNotification';

function AddEditLocation(props: any): JSX.Element {
  const partner = props?.route?.params?.partnerId;
  const locId = props?.route?.params?.locationId;
  const editLoc = props?.route?.params?.edit;
  const mainLoc = props?.route?.params?.mainLoc;
  const phoneNumber = props?.route?.params?.phoneNumber;
  const isMap = props?.route?.params?.isMap;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const {profileData} = useAppSelector(state => state.profile);
  const phoneInput = useRef<PhoneInput>(null);
  const [customNumber, setCustomNumber] = useState(
    !!profileData?.mobile && !editLoc
      ? profileData?.mobile.replace('971', '')
      : phoneNumber?.replace(/^(?:\+?971|[+])|,/g, ''),
  );
  const [countryCode, setCountryCode] = useState('971');
  const dispatch = useAppDispatch();
  const [call, setCall] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const {countries, states, areas, emirateOnly} = useAppSelector(
    state => state.user.signUp,
  );
  const {authenticatedUser} = useAppSelector(state => state.auth);
  const {userAddLocations, dataLoader, error} = useAppSelector(
    state => state.addLocation,
  );
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    address: '',
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const initialCreateObject = {
    name: '',
    email: profileData?.email,
    defaultShippingAddress: false,
    country: '',
    emirate: '',
    area: '',
    phoneNumber: profileData?.mobile,
    street: '',
    building: '',
    moreInfo: '',
    latitude: locationData?.latitude,
    longitude: locationData?.longitude,
  };
  const [initialValues, setInitialValues] = useState(initialCreateObject);

  const _signupDataThunk = () => {
    dispatch(
      signupDataThunk({
        emirates: true,
      }),
    );
  };

  const _getAddLocation = (data: any) => {
    const actionData: any = {
      mobile: true,
      data: data,
      partnerId: editLoc ? locId?.toString() : partner?.toString(),
      formMode: editLoc ? 'edit' : 'create',
    };
    dispatch(getaddUserLocations(actionData)).then(res => {
      setLoader(false);
      if (
        res.payload?.result?.success &&
        res.payload?.result?.type == 'success'
      ) {
        NavigationService.navigate('Locations', {});
      } else if (
        !res.payload?.result?.success &&
        !res.payload?.result?.in_service
      ) {
        _setModalData(res.payload?.result?.message, t('sorry'));
      } else {
        _setModalData(t('cantSave'), t('sorry'));
      }
    });
  };

  useEffect(() => {
    setCall(true);
  }, [userAddLocations]);

  useEffect(() => {
    setCall(true);
  }, []);

  useEffect(() => {
    if (call) {
      _signupDataThunk();
    }
  }, [call]);

  const _setModalData = (msg: string, title?: string, fun?: () => void) => {
    dispatch(
      setModalData({
        modalVisible: true,
        message: msg,
        ...(title && {title}),
        ...(fun && {fun}),
      }),
    );
  };

  useEffect(() => {
    if (
      !editLoc &&
      !hasInitialized &&
      locationData?.latitude &&
      locationData?.longitude
    ) {
      setInitialValues(prevValues => ({
        ...prevValues,
        latitude: locationData?.latitude || prevValues.latitude,
        longitude: locationData?.longitude || prevValues.longitude,
      }));
      setHasInitialized(true);
    }
  }, [locationData]);

  const _getLocation = () => {
    if (editLoc) {
      setLoader(true);
      dispatch(
        getLocationInfo({
          userId: authenticatedUser,
          partnerId: locId?.toString(),
          mobile: true,
        }),
      ).then(res => {
        setLoader(false);
        if (res?.payload?.result && res?.payload?.result?.data) {
          setUserInfo(res?.payload?.result?.data);
        } else {
          _setModalData(t('cantEdit'), t('sorry'));
        }
      });
    }
  };

  useEffect(() => {
    _getLocation();
  }, []);

  const _submit = (value: any) => {
    setLoader(true);
    const data = {
      name: value.name,
      email: value.email,
      mobile: `${value.phoneNumber.replace(/^971/, '')}`,
      // mobile: customNumber.replace(/[^0-9]/g, ''),
      mobile_code: '971',
      default_location: value.defaultShippingAddress,
      country_id: value.country,
      ...(isMap
        ? {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            shipping_address: locationData?.address,
          }
        : {
            areaManual: value.area,
            stateManual: value.emirate,
            streetManual: value.street,
            buildingManual: value.building,
            moreInfoManual: value.moreInfo,
          }),
    };
    _getAddLocation(data);
  };

  const getLocationSchema = () => {
    const baseSchema = {
      name: Yup.string().required(t('required')),
      email: Yup.string().email(t('invalidEmail')).required(t('required')),
      phoneNumber: Yup.string()
        .required(t('required'))
        .test('isValidPhone', 'invalidPhone', function (value) {
          const {path, createError} = this;
          const isValid = phoneInput.current?.isValidNumber(value);
          return isValid || createError({path, message: t('invalidNumber')});
        }),
      country: Yup.string().required(t('required')),
      ...(isMap
        ? {}
        : {
            emirate: Yup.string().required(t('required')),
            area: Yup.string().required(t('required')),
            street: Yup.string().required(t('required')),
            building: Yup.string().required(t('required')),
            moreInfo: Yup.string().required(t('required')),
          }),
    };
    return Yup.object().shape(baseSchema);
  };

  useEffect(() => {
    if (editLoc && userInfo && Object.keys(userInfo).length > 0) {
      let initEditNumber = phoneNumber?.replace(/^(?:\+?971|[+])|,/g, '');
      const initialEditObject = {
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        defaultShippingAddress: userInfo?.default_location || false,
        country: userInfo?.country_id || '',
        emirate: userInfo?.state_id || '',
        area: userInfo?.area_id || '',
        phoneNumber: initEditNumber || '',
        street: userInfo?.street || '',
        building: userInfo?.building || '',
        moreInfo: userInfo?.extra_location_information || '',
        latitude: userInfo?.lat || null,
        longitude: userInfo?.long || null,
      };
      if (isMap) {
        initialEditObject.emirate = '';
        initialEditObject.area = '';
        initialEditObject.street = '';
        initialEditObject.building = '';
        initialEditObject.moreInfo = '';
      }
      setInitialValues(initialEditObject);
    }
  }, [userInfo, isMap]);

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

  const handlePhoneNumberChange = (value: string) => {
    if (!value.startsWith('+971')) {
      value = `+971${value.replace(/[^0-9]/g, '')}`;
    }
    setCustomNumber(value);
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
    <>
      <Header
        hideDrawer
        hideNotification
        title={editLoc ? t('editLocation') : t('addLocations')}
      />
      <Loader isLoading={loader}>
        <KeyboardAvoidingView
          style={styles.appContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={getLocationSchema()}
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
              <FlatList
                style={styles.container}
                data={[
                  {
                    type: 'input',
                    label: t('title'),
                    name: 'name',
                    keyboardType: 'default',
                  },
                  {
                    type: 'input',
                    label: t('email'),
                    name: 'email',
                    keyboardType: 'email-address',
                  },
                  {
                    type: 'input',
                    label: t('phoneNumber'),
                    name: 'phoneNumber',
                    keyboardType: 'phone-pad',
                  },

                  {
                    type: 'dropdown',
                    label: t('country'),
                    name: 'country',
                    items: countries,
                  },

                  ...(isMap ? [{type: 'map', name: 'location'}] : []),

                  ...(!isMap
                    ? [
                        {
                          type: 'dropdown',
                          label: t('emirate'),
                          name: 'emirate',
                          items: states,
                        },
                        {
                          type: 'dropdown',
                          label: t('area'),
                          name: 'area',
                          items:
                            areas?.filter(
                              p => p?.state_id?.[0] === values.emirate,
                            ) || [],
                        },
                        {
                          type: 'input',
                          label: t('street'),
                          name: 'street',
                          keyboardType: 'default',
                        },
                        {
                          type: 'input',
                          label: t('building'),
                          name: 'building',
                          keyboardType: 'default',
                        },
                        {
                          type: 'input',
                          label: t('moreInfo'),
                          name: 'moreInfo',
                          keyboardType: 'default',
                        },
                      ]
                    : []),
                  {
                    type: 'checkbox',
                    title: t('setDefault'),
                    name: 'defaultShippingAddress',
                  },
                ]}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="always"
                renderItem={({item}) => {
                  if (item.type === 'input' && item.name === 'phoneNumber') {
                    return (
                      <Input
                        phoneInputType
                        phoneInput={phoneInput}
                        label={t('phoneNumber')}
                        name={'phoneNumber'}
                        setFieldValue={setFieldValue}
                        setCustomNumber={handlePhoneNumberChange}
                        setCountryCode={setCountryCode}
                        onBlur={handleBlur('phoneNumber')}
                        value={customNumber}
                        requiredStar
                        defaultCode="AE"
                        countryPickerProps={{onSelect: handleCountrySelect}}
                        error={
                          errors.phoneNumber && touched.phoneNumber
                            ? errors.phoneNumber
                            : null
                        }
                        disabled={mainLoc}
                      />
                    );
                  } else if (item.type === 'dropdown' && item.name === 'area') {
                    return (
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
                    );
                  } else if (item.type === 'input') {
                    return (
                      <Input
                        textInput
                        label={item.label}
                        onChangeText={handleChange(item.name)}
                        onBlur={handleBlur(item.name)}
                        value={values[item.name]}
                        keyboardType={item.keyboardType}
                        requiredStar
                        error={
                          errors[item.name] && touched[item.name]
                            ? errors[item.name]
                            : null
                        }
                        disabled={
                          mainLoc &&
                          (item?.name === 'email' || item?.name === 'name')
                        }
                      />
                    );
                  } else if (item.type === 'dropdown') {
                    return (
                      <Input
                        label={item.label}
                        dropdown
                        items={item.items}
                        onChangeValue={(selectedItem: any) =>
                          setFieldValue(item.name, selectedItem.id)
                        }
                        onBlur={() => handleBlur(item.name)}
                        placeholder={t('choose')}
                        requiredStar
                        error={
                          errors[item.name] && touched[item.name]
                            ? errors[item.name]
                            : null
                        }
                        labelField="name"
                        valueField="id"
                        value={values[item.name]}
                      />
                    );
                  } else if (item.type === 'checkbox') {
                    return (
                      <Input
                        checkbox
                        type="checkbox"
                        title={item.title}
                        checked={values[item.name]}
                        onPress={() =>
                          setFieldValue(item.name, !values[item.name])
                        }
                        checkedColor={colors.golden}
                        error={
                          errors[item.name] && touched[item.name]
                            ? errors[item.name]
                            : null
                        }
                      />
                    );
                  } else if (item.type === 'map' && isMap) {
                    return (
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
                        setLocationProps={value => handleLocationChange(value)}
                        styleLabel={{color: colors.darkBorder + 'bb'}}
                        styleAddress={{marginLeft: 0, flex: 1}}
                        onCoordinatesChange={handleCoordinatesChange}
                        initialLocation={
                          editLoc
                            ? {
                                latitude: userInfo?.lat,
                                longitude: userInfo?.long,
                                address: userInfo?.shipping_address,
                              }
                            : null
                        }
                      />
                    );
                  } else {
                    return null;
                  }
                }}
                ListFooterComponent={
                  <Button
                    title={t('saveAddress')}
                    h3
                    styleText={{color: '#fff'}}
                    style={styles.saveBtn}
                    onPress={handleSubmit}
                  />
                }
              />
            )}
          </Formik>
        </KeyboardAvoidingView>
      </Loader>
    </>
  );
}

export default AddEditLocation;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      paddingHorizontal: 12 * BW(),
    },
    container: {
      paddingBottom: 8 * BW(),
    },
    saveBtn: {
      backgroundColor: colors.primary,
      height: 'auto',
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16 * BW(),
      marginHorizontal: 16 * BW(),
    },
    renderItem: {
      paddingHorizontal: 10 * BW(),
      paddingVertical: 8 * BW(),
      backgroundColor: colors.backgroundColorInput,
      color: colors.text,
    },
  });
