import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BW} from '../style/theme';
import {useTheme} from '@react-navigation/native';

const dotDimention = 6 * BW();
const activeDotDimention = 10 * BW();

const Pagination = ({data, activeIndex, stylesProps, dotstyle}: any) => {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  return (
    <View style={[styles.paginationContainer, {...stylesProps}]}>
      {data?.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
            {...dotstyle},
          ]}
        />
      ))}
    </View>
  );
};
const getStyle = (colors: any) =>
  StyleSheet.create({
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10 * BW(),
    },
    dot: {
      width: dotDimention,
      height: dotDimention,
      borderRadius: dotDimention,
      marginHorizontal: dotDimention / 2,
      backgroundColor: colors.gray + 'cc',
    },
    activeDot: {
      width: activeDotDimention,
      height: activeDotDimention,
      borderRadius: activeDotDimention,
    },
  });

export default Pagination;
