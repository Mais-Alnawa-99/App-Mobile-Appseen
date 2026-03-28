import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import RNRestart from 'react-native-restart';
import Button from '../Button';
import Text from '../Text';
import theme, {BW} from '../../style/theme';
export default function Error({
  error_connection,
  onPressProps,
}: {
  error_connection: boolean;
  onPressProps?: any;
}) {
  const styles = getStyles();
  const onPress = () => {
    RNRestart.Restart();
  };
  let {width, height} = Dimensions.get('window');
  return (
    <View style={styles.container}>
      <Text h3 style={styles.errorText}>
        عذراً حدث خطأ ما
      </Text>
      <Button
        title={'إعادة الاتصال'}
        onPress={() => (onPressProps ? onPressProps() : onPress())}
        style={{
          backgroundColor: theme.themeObject.colors.primaryColor,
          height: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50%',
        }}
        h3
        styleText={{color: '#fff'}}
      />
    </View>
  );
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: theme.themeObject.colors.primaryColor,
      textAlign: 'center',
      marginBottom: 20 * BW(),
    },
  });
