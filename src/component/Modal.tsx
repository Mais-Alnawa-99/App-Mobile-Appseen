import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { hideModal, setOtp } from '../redux/reducers/modal';
import theme, { BH, BW } from '../style/theme';
import Text from './Text';
import Button from './Button';
import { isArabic } from '../locales';
import reactotron from '../redux/reactotron';
import { useTranslation } from 'react-i18next';
import WebViewCustom from './WebView';
import { DarkTheme, MyTheme } from '../style/theme';
import { colors } from 'react-native-elements';

const CustomModal = () => {
  const {
    modalVisible,
    title,
    message,
    fun,
    showOtp,
    otp,
    error,
    hideCancel,
    webUrl,
    webView,
    fileView,
    CustomView,
    directFormMessage,
    requstDetails,
    hideConfirm,
    showClose,
    titleConfirm,
    customStyle,
  } = useAppSelector(state => state.modal);
  const setOtpOtp = o => {
    dispatch(setOtp(o));
  };
  const dispatch = useAppDispatch();

  const [themeSelected, setThemeSelected] = useState(MyTheme);
  const isDarkMode = useColorScheme() === 'dark';

  // const initTheme = async () => {
  //   // let theme = await reduxStorage.getItem('@theme');
  //   if (!selectedTheme) {
  //     setThemeSelected(MyTheme.colors);
  //     if (isDarkMode) {
  //       setThemeSelected(DarkTheme.colors);
  //     }
  //   } else {
  //     if (theme === 'dark') {
  //       setThemeSelected(DarkTheme.colors);
  //     }
  //     if (theme === 'blue') {
  //       setThemeSelected(BlueTheme.colors);
  //     }
  //     if (theme === 'brown') {
  //       setThemeSelected(MyTheme.colors);
  //     }
  //     if (theme === 'red') {
  //       setThemeSelected(RedTheme.colors);
  //     }
  //     if (theme === 'green') {
  //       setThemeSelected(GreenTheme.colors);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   initTheme();
  // }, [theme, selectedTheme]);
  const styles = getStyles(themeSelected.colors);
  const CELL_COUNT = 6;
  const { t } = useTranslation();
  const ref = useBlurOnFulfill({ otp, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    otp,
    setOtp,
  });
  const renderCell = ({ index, symbol, isFocused }) => (
    <View style={styles.otpBox}>
      <Text
        key={index}
        h1
        bold
        style={{ textAlign: 'center', color: themeSelected.textColor }}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    </View>
  );
  return (
    <>
      {modalVisible && (
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={2}
          reducedTransparencyFallbackColor={themeSelected.primary}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          dispatch(hideModal());
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              (webView || fileView) && { minHeight: '80%' },
              (showOtp || directFormMessage) && { minHeight: '30%' },
              requstDetails && { minHeight: '45%' },
              CustomView && {
                borderWidth: 0.5,
                borderColor: colors.gray + '00',
                minHeight: '28%',
              },
              customStyle,
            ]}
          >
            <View style={{ flex: 1, position: 'relative' }}>
              {title && (
                <View style={{ position: 'relative' }}>
                  <Text
                    h2
                    bold
                    style={{
                      marginTop: 8 * BW(),
                      color: themeSelected.textColor,
                    }}
                  >
                    {title}
                  </Text>
                  {(webView || fileView) && (
                    <>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                        }}
                      >
                        <Button
                          title={'X'}
                          onPress={() => dispatch(hideModal())}
                          h2
                          style={styles.closeBtn}
                        />
                      </View>
                    </>
                  )}
                  {showClose && (
                    <>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                        }}
                      >
                        <Button
                          title={'X'}
                          onPress={() => dispatch(hideModal())}
                          h2
                          style={styles.closeBtn}
                        />
                      </View>
                    </>
                  )}
                  <View
                    style={{
                      borderColor: themeSelected.gray + '77',
                      borderBottomWidth: 0.3 * BW(),
                      height: 0,
                      paddingBottom: 8 * BW(),
                      marginTop: 3 * BW(),
                    }}
                  />
                </View>
              )}

              {webView && (
                <>
                  <WebViewCustom url={webUrl} />
                </>
              )}

              {message && (
                <View style={{ marginTop: 8 * BW() }}>
                  <Text h4 style={styles.modalText}>
                    {message}
                  </Text>
                </View>
              )}
              {CustomView && eval(CustomView)}
              {showOtp && (
                <View
                  style={{
                    marginVertical: 20 * BW(),
                    marginBottom: 25 * BW(),
                  }}
                >
                  <CodeField
                    ref={ref}
                    value={otp}
                    onChangeText={otp => setOtpOtp(otp)}
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
              )}
              {error && (
                <View style={{ marginTop: 8 * BW() }}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {webView || fileView ? (
                <></>
              ) : !!fun ? (
                <>
                  {!hideConfirm && (
                    <Button
                      title={titleConfirm ? titleConfirm : t('OK')}
                      style={hideCancel ? styles.btnOK : styles.btn}
                      styleText={{
                        color: '#fff',
                      }}
                      onPress={() => {
                        dispatch(hideModal());
                        fun();
                      }}
                    />
                  )}
                  <View style={{ flex: 1 }} />
                  {!hideCancel && (
                    <Button
                      title={t('Cancel')}
                      style={hideConfirm ? styles.btn : styles.cancleBtn}
                      styleText={{
                        color: '#000',
                      }}
                      onPress={() => dispatch(hideModal())}
                    />
                  )}
                </>
              ) : (
                !hideConfirm && (
                  <Button
                    title={t('OK')}
                    styleText={{
                      color: '#fff',
                    }}
                    style={styles.btnOK}
                    onPress={() => dispatch(hideModal())}
                  />
                )
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const getStyles = (themeSelected: any) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    modalView: {
      backgroundColor: themeSelected.background,
      borderRadius: 12 * BW(),
      paddingHorizontal: 15 * BW(),
      paddingVertical: 10 * BW(),
      width: '90%',
      minHeight: '25%',
      borderColor: themeSelected.gray + '66',
      borderWidth: 0.2 * BW(),
    },

    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      color: themeSelected.textColor,
    },
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
      padding: 8 * BW(),
      paddingHorizontal: 10 * BW(),
      minWidth: '45%',
      backgroundColor: themeSelected.primaryColor,
      color: themeSelected.background,
      flex: 1,
    },
    btnOK: {
      width: 'auto',
      height: 'auto',
      padding: 8 * BW(),
      paddingHorizontal: 10 * BW(),
      minWidth: '45%',
      color: themeSelected.background,
      backgroundColor: themeSelected.primaryColor,
    },
    otpBox: {
      width: 35 * BW(),
      paddingVertical: 5 * BW(),
      minHeight: 40 * BW(),
      borderWidth: 1 * BW(),
      borderRadius: 8 * BW(),
      borderColor: themeSelected.gray + '99',
      backgroundColor: themeSelected.background,
      color: themeSelected.primaryColor,
      fontSize: 18 * BW(),
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
      paddingHorizontal: 8 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8 * BW(),
    },
    cancleBtn: {
      width: 'auto',
      height: 'auto',
      padding: 8 * BW(),
      paddingHorizontal: 10 * BW(),
      minWidth: '45%',
      backgroundColor: 'transparent',
      color: themeSelected.primaryColor,
      flex: 1,
      borderColor: themeSelected.primaryColor,
      borderWidth: 0.7 * BW(),
    },
  });

export default CustomModal;
