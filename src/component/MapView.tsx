import {useTheme} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useTranslation} from 'react-i18next';
import {BW} from '../style/theme';
function CustomMapView({
  latitude,
  longitude,
  location,
  title,
  children,
  ...props
}: {
  latitude?: number;
  longitude?: number;
  location?: string;
  title?: string;
  children?: React.ReactNode;
}): JSX.Element {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const styles = getStyle(colors);

  return (
    <View
      style={{
        borderRadius: 8 * BW(),
        overflow: 'hidden',
        flex: 1,
        minHeight: 160 * BW(),
      }}>
      <MapView
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        loadingBackgroundColor="#F5F6FA"
        showsUserLocation={true}
        showsCompass={true}
        provider="google"
        style={{width: '100%', height: '100%', flex: 1}}
        {...props}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {children}
      </MapView>
    </View>
  );
}
const getStyle = (colors: any) => StyleSheet.create({});
export default CustomMapView;
