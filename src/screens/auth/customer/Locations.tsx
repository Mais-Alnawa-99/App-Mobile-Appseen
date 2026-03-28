import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Button from '../../../component/Button';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import Header from '../../../component/Header';
import {reduxStorage, store} from '../../../redux/store';
import {useFocusEffect} from '@react-navigation/native';
import Settings from './Settings';
import LinearGradient from 'react-native-linear-gradient';
import {getuserLocations} from '../../../redux/reducers/User/thunk/locations';
import NavigationService from '../../../naigation/NavigationService';
import {number} from 'yup';
import {getdefaultUserLocations} from '../../../redux/reducers/User/thunk/locations/setDefaultLocation';
import {deleteUserLocations} from '../../../redux/reducers/User/thunk/locations/deleteLocation';
import {setModalData} from '../../../redux/reducers/modal';
import Loader from '../../../component/Loader';

type LocationsProps = {
  shipping?: boolean;
};

function Locations({shipping = false}: LocationsProps): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {
    userLocations,
    userPartner,
    isMap,
    dataLoader: userLocationsLoader,
    error: locationsError,
  } = useAppSelector(state => state.locations);
  const {authenticatedUser} = useAppSelector(state => state.auth);
  const [locations, setLocations] = useState(userLocations || []);
  const [partner, setPartner] = useState(userPartner || 0);
  const [defaultLocationIndex, setDefaultLocationIndex] = useState<
    number | null
  >(null);

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
    if (Array.isArray(userLocations)) {
      setLocations(userLocations);
      const defaultIndex = userLocations?.findIndex(
        loc => loc.default_location,
      );
      setDefaultLocationIndex(defaultIndex >= 0 ? defaultIndex : null);
    }
    setPartner(userPartner);
  }, [userLocations]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getuserLocations({userId: authenticatedUser}));
      return () => {};
    }, [dispatch, authenticatedUser]),
  );

  if (locationsError) {
    return (
      <View>
        <Text>{t('Error loading profile data')}</Text>
      </View>
    );
  }

  const handleSetDefault = async (index: number) => {
    const location = locations[index];
    if (authenticatedUser && location?.id) {
      try {
        const result = await dispatch(
          getdefaultUserLocations({
            userId: authenticatedUser,
            partnerId: location.id,
          }),
        ).unwrap();
        if (result?.result?.data?.success) {
          setLocations((prevLocations: any) =>
            prevLocations.map((loc, i) => ({
              ...loc,
              default_location: i === index,
            })),
          );
          setDefaultLocationIndex(index);
        } else {
          console.error('Cannot set location as default');
        }
      } catch (error) {
        console.error('Error setting default location:', error);
      }
    } else {
      console.error('Invalid userId or partnerId');
    }
  };

  const _delLocation = (loc: number) => {
    store.dispatch(
      setModalData({
        modalVisible: true,
        title: t('deletLocation'),
        message: t('sureDelete'),
        fun: () => {
          if (authenticatedUser) {
            dispatch(
              deleteUserLocations({
                userId: authenticatedUser,
                partnerId: loc?.toString(),
              }),
            ).then(res => {
              if (res?.payload?.result?.success) {
                _setModalData(t('deleteSuccessfuly'), undefined, async () => {
                  dispatch(getuserLocations({userId: authenticatedUser}));
                });
              } else if (res?.payload?.result?.error) {
                _setModalData(t('cantDelete'), t('sorry'));
              }
            });
          }
        },
      }),
    );
  };

  return (
    <>
      {!shipping && (
        <Header hideDrawer hideNotification title={t('myLocations')} />
      )}

      <Loader isLoading={!shipping ? userLocationsLoader : false}>
        <ScrollView
          style={styles.appContainer}
          showsVerticalScrollIndicator={false}>
          <View style={shipping && {backgroundColor: '#fff'}}>
            {Array.isArray(locations) &&
              locations?.map((location: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.container,
                    shipping && {
                      paddingVertical: 6 * BW(),
                      backgroundColor: '#fff',
                    },
                  ]}>
                  <TouchableOpacity
                    style={[
                      {
                        borderBottomWidth: 1,
                        borderColor: '#33333333',
                        paddingVertical: 16 * BW(),
                      },
                      shipping && {
                        borderWidth: 1,
                        borderRadius: 12,
                        borderColor: '#33333333',
                        padding: 16 * BW(),
                        backgroundColor: location?.default_location
                          ? '#ebefffff'
                          : '#fff',
                      },
                    ]}
                    onPress={
                      shipping ? () => handleSetDefault(index) : undefined
                    }>
                    <View
                      style={[
                        styles.common,
                        styles.type,

                        shipping && {
                          padding: 0,
                          height: 40 * BH(),
                          backgroundColor: '#fff',
                        },
                        location?.default_location &&
                          shipping && {
                            backgroundColor: '#ebefffff',
                          },
                      ]}>
                      <View style={styles.name}>
                        <Image
                          source={require('../../../assets/icons/location.png')}
                          style={styles.icon}
                        />
                        <Text h3 bold>
                          {location?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 4 * BW(),
                          alignItems: 'center',
                        }}>
                        {location?.default_location && (
                          <View
                            style={[
                              styles.default,
                              shipping && {backgroundColor: '#D2DAF9'},
                            ]}>
                            <Text
                              h3
                              style={{
                                color: shipping ? '#262D47' : colors.green,
                              }}>
                              {t('default')}
                            </Text>
                          </View>
                        )}
                        {shipping && (
                          <TouchableOpacity
                            onPress={() =>
                              NavigationService.navigate('AddEditLocation', {
                                locationId: location?.id,
                                edit: true,
                                mainLoc: location?.main_location,
                                phoneNumber: location?.mobile,
                                isMap: isMap,
                              })
                            }>
                            <Image
                              source={require('../../../assets/icons/edit.png')}
                              style={[
                                {width: 26 * BW(), height: 26 * BW()},
                                {tintColor: '#292D32'},
                              ]}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={!shipping && {paddingHorizontal: 12 * BW()}}>
                      <View style={[styles.common, styles.name]}>
                        <Image
                          source={require('../../../assets/icons/locIcon.png')}
                          style={styles.icon}
                        />
                        <Text h3>
                          {location?.state_name} , {location?.area_name},
                          {location?.street}
                        </Text>
                      </View>

                      <View style={[styles.common, styles.name]}>
                        <Image
                          source={require('../../../assets/icons/call.png')}
                          style={styles.icon}
                        />
                        <Text h3>{location?.mobile}</Text>
                      </View>
                      {!shipping && (
                        <View
                          style={[
                            styles.common,
                            styles.name,
                            {
                              alignItems: 'flex-end',
                              justifyContent: location?.default_location
                                ? 'flex-end'
                                : 'space-between',
                            },
                          ]}>
                          {!location?.default_location && (
                            <>
                              <TouchableOpacity
                                style={{
                                  borderBottomColor: colors.goldeText,
                                  borderBottomWidth: 0.5,
                                }}
                                onPress={() => handleSetDefault(index)}>
                                <Text h3 style={{color: colors.goldeText}}>
                                  {t('setDefault')}
                                </Text>
                              </TouchableOpacity>
                            </>
                          )}
                          <View
                            style={[
                              styles.common,
                              styles.name,
                              {justifyContent: 'space-between'},
                            ]}>
                            <TouchableOpacity
                              onPress={() =>
                                NavigationService.navigate('AddEditLocation', {
                                  locationId: location?.id,
                                  edit: true,
                                  mainLoc: location?.main_location,
                                  phoneNumber: location?.mobile,
                                  isMap: isMap,
                                })
                              }
                              style={styles.editdelIconContainer}>
                              <Image
                                source={require('../../../assets/icons/edit.png')}
                                style={[
                                  styles.editdelIcon,
                                  {tintColor: '#292D32'},
                                ]}
                              />
                            </TouchableOpacity>

                            {!location?.main_location && (
                              <TouchableOpacity
                                onPress={() => _delLocation(location?.id)}
                                style={styles.editdelIconContainer}>
                                <Image
                                  source={require('../../../assets/icons/del.png')}
                                  style={[
                                    styles.editdelIcon,
                                    {tintColor: colors.primaryColor},
                                  ]}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            <Button
              title={shipping ? t('addNewShipping') : t('addNew')}
              h3
              style={shipping ? styles.addBtnShipping : styles.addBtn}
              styleText={{color: shipping ? '#000' : '#fff'}}
              onPress={() =>
                NavigationService.navigate('AddEditLocation', {
                  partnerId: partner,
                  isMap: isMap,
                })
              }
            />
          </View>
        </ScrollView>
      </Loader>
    </>
  );
}

export default Locations;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    container: {
      paddingHorizontal: 10 * BW(),
    },
    common: {
      marginVertical: 2 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
    },
    type: {
      backgroundColor: '#FAFAFF',
      borderRadius: 10 * BW(),
      padding: 12 * BW(),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60 * BH(),
    },
    name: {
      flexDirection: 'row',
      gap: 12 * BW(),
    },
    icon: {
      width: 20 * BW(),
      height: 20 * BW(),
      tintColor: '#8E8EA1',
    },
    default: {
      borderRadius: 50 * BW(),
      width: 70 * BW(),
      backgroundColor: colors.green + '11',
      height: 35 * BH(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    editdelIconContainer: {
      backgroundColor: '#FAFAFF',
      width: 48 * BW(),
      height: 48 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
    },
    editdelIcon: {
      width: 30 * BW(),
      height: 30 * BH(),
    },
    addBtn: {
      backgroundColor: colors.primary,
      height: 'auto',
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16 * BW(),
      marginHorizontal: 16 * BW(),
    },
    addBtnShipping: {
      height: 'auto',
      width: '95%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16 * BW(),
      marginHorizontal: 16 * BW(),
      borderWidth: 2 * BW(),
      borderStyle: 'dashed',
    },
  });
