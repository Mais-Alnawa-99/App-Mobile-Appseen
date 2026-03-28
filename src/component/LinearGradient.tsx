import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {BW} from '../style/theme';

function LinearGradientCustom({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: {};
}): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);

  return (
    <LinearGradient
      colors={['#FFF', '#FFF', '#FFF', '#ECECEC']}
      locations={[0, 0.381, 0.681, 0.9084]}
      style={style}>
      {children}
    </LinearGradient>
  );
}

const getStyle = (colors: any) => StyleSheet.create({});
export default LinearGradientCustom;
