import React, {useEffect, useState} from 'react';
import Text from '../../../component/Text';
import {useTheme} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BH, BW} from '../../../style/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

function Counter(props: any): JSX.Element {
  const {
    count,
    increaseCount,
    decreaseCount,
    cart = false,
    styleCounter = {},
  } = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);

  return (
    <View>
      <View
        style={[
          styles.flexRow,
          {gap: 8 * BW(), justifyContent: 'space-between', marginTop: 4 * BW()},
          styleCounter,
        ]}>
        <View style={styles.flexRow}>
          <View
            style={[
              styles.cartCount,
              styles.flexRow,
              styles.square,
              {
                height: cart ? 32 * BW() : 48 * BH(),
                width: cart ? 80 * BW() : 86 * BW(),
              },
            ]}>
            <TouchableOpacity
              onPress={increaseCount}
              style={[styles.flexRow, styles.cardCountNum]}>
              <AntDesign name="plus" size={16 * BW()} color="#000" />
            </TouchableOpacity>
            <View
              style={[
                styles.flexRow,
                styles.cardCountNum,
                {height: cart ? 30 * BW() : 'auto'},
              ]}>
              <Text style={{fontSize: 16 * BW()}}>{count}</Text>
            </View>
            <TouchableOpacity
              onPress={decreaseCount}
              style={[styles.flexRow, styles.cardCountNum]}>
              <AntDesign name="minus" size={16 * BW()} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
export default Counter;

const getStyle = (colors: any) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    priceContainer: {
      gap: 4 * BW(),
    },
    cartCount: {
      padding: 1 * BW(),
    },
    square: {
      borderRadius: 10 * BW(),
      borderColor: colors.gray + 'cc',
      borderWidth: 1 * BW(),
    },
    cardCountNum: {
      justifyContent: 'center',
      width: 25 * BW(),
    },
  });
