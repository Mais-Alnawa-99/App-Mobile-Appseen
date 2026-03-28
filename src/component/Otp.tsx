import React, { useState } from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '@react-navigation/native';

import theme, { BH, BW } from '../style/theme';
import Text from './Text';
import { isArabic } from '../locales';
import { replaceArabicNumerals } from './Generalfunction';

const OTPCustom = ({ otp, setOtp, setOtpOtp, cellCount }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const CELL_COUNT = cellCount ? cellCount : 6;
  const ref = useBlurOnFulfill({ otp, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    otp,
    setOtp,
  });
  const renderCell = ({ index, symbol, isFocused }) => (
    <View style={styles.otpBox}>
      <Text
        key={index}
        style={{ textAlign: 'center', fontSize: 26 * BW() }}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    </View>
  );
  return (
    <View
      style={{
        marginVertical: 10 * BW(),
        marginBottom: 25 * BW(),
      }}
    >
      <CodeField
        ref={ref}
        value={otp}
        onChangeText={otp => setOtpOtp(replaceArabicNumerals(otp))}
        cellCount={CELL_COUNT}
        rootStyle={{
          width: '100%',
          alignSelf: 'center',
          flexDirection: isArabic() ? 'row-reverse' : 'row',
          alignItems: 'center',
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    modalView: {
      backgroundColor: colors.background,
      borderRadius: 12 * BW(),
      paddingHorizontal: 15 * BW(),
      paddingVertical: 10 * BW(),
      width: '90%',
      minHeight: '25%',
      borderColor: colors.gray + '66',
      borderWidth: 0.2 * BW(),
    },

    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {},
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 22,
    },
    btn: {
      width: 'auto',
      height: 'auto',
      padding: 6 * BW(),
      paddingHorizontal: 10 * BW(),
      minWidth: '45%',
      backgroundColor: colors.primaryColor + '99',
      color: colors.background,
      flex: 1,
    },
    btnOK: {
      width: 'auto',
      height: 'auto',
      padding: 6 * BW(),
      paddingHorizontal: 10 * BW(),
      minWidth: '45%',
      color: colors.background,
      backgroundColor: colors.primaryColor + '99',
    },
    otpBox: {
      width: 45 * BW(),
      paddingVertical: 5 * BW(),
      minHeight: 55 * BW(),
      borderWidth: 1 * BW(),
      borderRadius: 8 * BW(),
      borderColor: colors.gray + '99',
      backgroundColor: colors.background,
      color: colors.primaryColor,
      fontSize: 22 * BW(),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: '#db2c43',
      fontSize: 8 * BW(),
      lineHeight: 15 * BW(),
    },
    closeBtn: {
      height: 'auto',
      width: 'auto',
      padding: 3 * BW(),
      marginBottom: 8 * BW(),
    },
  });

export default OTPCustom;
