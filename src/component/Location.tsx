import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  LayoutAnimation,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  TextInput,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Text from './Text';
import theme, {BH, BW} from '../style/theme';
import {requestLocation} from './Generalfunction';
import Animated from 'react-native-reanimated';
import {useTheme} from '@react-navigation/native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Button from './Button';
import {useTranslation} from 'react-i18next';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {isArabic} from '../locales';
import {getShippingAddress} from '../redux/reducers/User/thunk/locations/getLocInfo';
import {useAppDispatch, useAppSelector} from '../redux/store';
const MyLocation = ({
  style,
  icon,
  styleIcon,
  styleAddress,
  label,
  styleLabel,
  redStar,
  styleContainer,
  press,
  setLocationProps,
  is_expand,
  onCoordinatesChange,
  initialLocation,
  hideSearch,
  loggedIn,
}: any) => {
  const dispatch = useAppDispatch();
  const {authenticatedUser} = useAppSelector(store => store.auth);
  const [location, setLocation] = useState(initialLocation || null);
  const [address, setAddress] = useState(
    initialLocation?.address ? initialLocation?.address : '',
  );
  const [error, setError] = useState('');
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedInLoc, setLoggedInLoc] = useState('');
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        setError('Location permission denied');
        return false;
      }
    } catch (err) {
      setError(err);
      return false;
    }
  };
  useEffect(() => {
    if (!isManualUpdate && initialLocation) {
      setLocation(initialLocation);
      if (initialLocation.address) {
        setAddress(initialLocation.address);
      }
    }
  }, [initialLocation, isManualUpdate]);

  useEffect(() => {
    if (!initialLocation) {
      requestGetLocationPermission();
    }
  }, [initialLocation]);

  const requestGetLocationPermission = async () => {
    if (Platform.OS == 'android') {
      let permission = await requestLocationPermission();
      if (permission) {
        getLocation();
      }
    } else {
      getLocation();
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newLocation = {latitude, longitude};
        setLocation(newLocation);
        getAddress(newLocation);
      },
      error => setError(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };
  const loginLocation = () => {
    dispatch(
      getShippingAddress({
        userId: authenticatedUser ? authenticatedUser.toString() : '',
      }),
    ).then(res => {
      if (
        res?.payload?.networkSuccess == true &&
        !!res?.payload?.result?.data?.shipping_address
      ) {
        setLoggedInLoc(res?.payload?.result?.data?.shipping_address);
      }
    });
  };
  useEffect(() => {
    if (loggedIn) {
      loginLocation();
    }
  }, [loggedIn]);
  const onPress = async (nativeEvent: any) => {
    if (Platform.OS == 'android') {
      let permission = await requestLocationPermission();
      if (permission) {
        (setLocation(nativeEvent?.coordinate),
          getAddress(nativeEvent?.coordinate));
      }
    } else {
      (setLocation(nativeEvent?.coordinate),
        getAddress(nativeEvent?.coordinate));
    }
  };
  const [expanded, setExpanded] = useState(is_expand);

  const animationConfig = {
    duration: 200,
    create: {
      type: LayoutAnimation.Types.easeIn,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeIn,
    },
    delete: {
      type: LayoutAnimation.Types.easeOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(animationConfig);
    // setExpanded(!expanded);
  };

  const getAddress = position => {
    setIsManualUpdate(true);
    requestLocation({
      latitude: position?.latitude,
      longitude: position?.longitude,
    }).then(res => {
      setAddress(res?.formatted_address);
      setLocationProps(res?.formatted_address);
      onCoordinatesChange?.({
        latitude: position?.latitude,
        longitude: position?.longitude,
      });
    });
  };

  const onPressSearch = async (data: any, details: any) => {
    Keyboard.dismiss();
    if (details && details?.place_id) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?placeid=${details?.place_id}&key=AIzaSyBof5e9_Hw7zILtYGeoTW9H8uqVPfCGmRo`,
        );

        const result = await response.json();
        if (result?.result?.geometry?.location) {
          const {lat, lng} = result.result.geometry.location;
          setLocation({latitude: lat, longitude: lng});
          getAddress({latitude: lat, longitude: lng});
        } else {
          setError('Unable to fetch coordinates.');
        }
      } catch (error) {
        setError('Failed to fetch location details.');
      }
    } else {
      setError('Invalid place details.');
    }
  };
  const [mapRegion, setMapRegion] = useState({
    latitude: location?.latitude || 51.3068334,
    longitude: location?.longitude || 24.3311274,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    setMapRegion({
      latitude: location?.latitude || 51.3068334,
      longitude: location?.longitude || 24.3311274,
      latitudeDelta: mapRegion.latitudeDelta,
      longitudeDelta: mapRegion.longitudeDelta,
    });
  }, [location]);

  function alert(arg0: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={{...styleContainer}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {label && (
          <View>
            <Text h4 style={{...styleLabel}}>
              {label}
            </Text>
          </View>
        )}
        {redStar && (
          <Icon
            name="star-of-life"
            size={4 * BW()}
            color="#db2c43"
            style={{marginHorizontal: 3 * BW(), marginBottom: 8 * BW()}}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4 * BW(),
          overflow: 'hidden',
          ...style,
        }}
        onTouchEnd={press ? toggleAccordion : () => {}}>
        {(loggedIn || address) && (
          <Image
            resizeMode="contain"
            style={{
              width: 15 * BW(),
              height: 15 * BW(),
              resizeMode: 'contain',
              ...styleIcon,
            }}
            source={icon ? icon : require('../assets/icons/location.png')}
          />
        )}

        <Text
          h4
          numberOfLines={1}
          style={{
            marginLeft: 8 * BW(),
            paddingHorizontal: 4 * BW(),
            ...styleAddress,
          }}>
          {/* {loggedIn ? loggedInLoc : address || t('waitingAddress')} */}
          {loggedIn ? loggedInLoc : address || ''}
        </Text>
      </View>
      {!hideSearch && (
        <GooglePlacesAutocomplete
          placeholder={t('searchForPlace')}
          fetchDetails={true}
          onPress={(data, details = null) => {
            Keyboard.dismiss();
            onPressSearch(data, details);
          }}
          textInputProps={{
            onBlur: () => {
              Keyboard.dismiss();
            },
            placeholderTextColor: colors.textColor + '55',
          }}
          query={{
            key: 'AIzaSyBof5e9_Hw7zILtYGeoTW9H8uqVPfCGmRo',
            language: 'en',
          }}
          debounce={200}
          styles={{
            textInputContainer: {
              width: '100%',
              zIndex: 1000,
            },
            textInput: {
              color: colors.textColor,
              fontFamily: theme.themeObject.currentFontFamily.normal,
              textAlign: isArabic() ? 'right' : 'left',
              marginBottom: 10 * BW(),
              paddingHorizontal: 8 * BW(),
              borderWidth: 0.5 * BW(),
              borderRadius: 8 * BW(),
              padding: 8 * BW(),
              minHeight: 40 * BW(),
              borderColor: colors.gray + 'cc',
              lineHeight: 20 * BW(),
              backgroundColor: 'white',
            },
            listView: {
              zIndex: 3000,
              backgroundColor: 'white',
            },
            row: {
              backgroundColor: 'white',
              padding: 10 * BW(),
              flexDirection: 'row',
            },
            description: {
              color: colors.textColor,
              fontFamily: theme.themeObject.currentFontFamily.normal,
            },
            predefinedPlacesDescription: {
              color: colors.textColor,
            },
            separator: {
              height: 0.5,
              backgroundColor: colors.gray + '55',
            },
          }}
          keyboardShouldPersistTaps="always"
        />
      )}
      {expanded && (
        <View style={{overflow: 'hidden'}}>
          <Animated.View style={[expanded ? styles.expandedBody : styles.body]}>
            {Platform.OS == 'android' ? (
              <MapView
                style={{flex: 1}}
                showsUserLocation={true}
                showsCompass={true}
                loadingEnabled={true}
                provider="google"
                loadingIndicatorColor={colors.primary}
                loadingBackgroundColor="#F5F6FA"
                latitude={location?.latitude || 51.3068334}
                longitude={location?.longitude || 24.3311274}
                onPress={({nativeEvent}) => {
                  onPress(nativeEvent);
                }}
                region={{
                  latitude: location?.latitude || 51.3068334,
                  longitude: location?.longitude || 24.3311274,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onRegionChangeComplete={newRegion => {
                  setMapRegion({
                    latitude: newRegion.latitude,
                    longitude: newRegion.longitude,
                    latitudeDelta: newRegion.latitudeDelta,
                    longitudeDelta: newRegion.longitudeDelta,
                  });
                }}>
                <Marker
                  key={'0'}
                  coordinate={{
                    latitude: location?.latitude || 51.3068334,
                    longitude: location?.longitude || 24.3311274,
                  }}
                  title={address}

                  // description={address}
                />
              </MapView>
            ) : (
              <MapView
                style={{flex: 1}}
                showsUserLocation={true}
                showsCompass={true}
                loadingEnabled={true}
                provider="google"
                loadingIndicatorColor={colors.primary}
                loadingBackgroundColor="#F5F6FA"
                latitude={location?.latitude || 51.3068334}
                longitude={location?.longitude || 24.3311274}
                onPress={({nativeEvent}) => {
                  onPress(nativeEvent);
                }}
                region={mapRegion}
                onRegionChangeComplete={newRegion => {
                  setMapRegion({
                    latitude: newRegion.latitude,
                    longitude: newRegion.longitude,
                    latitudeDelta: newRegion.latitudeDelta,
                    longitudeDelta: newRegion.longitudeDelta,
                  });
                }}>
                <Marker
                  key={'0'}
                  coordinate={{
                    latitude: location?.latitude || 51.3068334,
                    longitude: location?.longitude || 24.3311274,
                  }}
                  title={address}

                  // description={address}
                />
              </MapView>
            )}
            {/* <TouchableOpacity
              onPress={getLocation}
              style={{
                position: 'absolute',
                bottom: 10 * BW(),
                right: 10 * BW(),
                backgroundColor: 'white',
                padding: 8 * BW(),
                borderRadius: 8 * BW(),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 15 * BW(),
                  height: 15 * BW(),
                  resizeMode: 'contain',
                  ...styleIcon,
                }}
                source={require('../assets/icons/location.png')}
              />
              <Text>{t('locMe')}</Text>
            </TouchableOpacity> */}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
    },

    body: {
      overflow: 'hidden',
      backgroundColor: colors.primaryColor + '09',
      borderBottomEndRadius: 12 * BW(),
      borderBottomStartRadius: 12 * BW(),
      padding: 12 * BW(),
    },
    expandedBody: {
      backgroundColor: colors.primaryColor + '09',
      minHeight: 200 * BW(),
    },
  });
export default MyLocation;
