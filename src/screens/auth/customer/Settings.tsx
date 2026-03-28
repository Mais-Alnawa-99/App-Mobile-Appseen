import React, {useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {t} from 'i18next';
import {Image} from 'react-native-elements';
import Button from '../../../component/Button';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import {store, useAppDispatch, useAppSelector} from '../../../redux/store';
import {getGeneralStyle} from '../../../style/styles';
import {isArabic} from '../../../locales';
import NavigationService from '../../../naigation/NavigationService';
import {hideModal, setModalData} from '../../../redux/reducers/modal';
import {clearAuthValues} from '../../../redux/reducers/User/startup';
import {_setLang} from '../../Lang';
import {getSessionPublicId} from '../../../redux/reducers/User/thunk/login';
import {
  setSessionValues,
  clearSessionUserValues,
} from '../../../redux/reducers/User/session';
import {_getQuantityCart} from '../../../naigation/tabs/BottomTab';
import {clearQuantityWishlist} from '../../../redux/reducers/wishlist/slice/quantityWishlist';
import appsFlyer from 'react-native-appsflyer';
export const _logOut = (sessionPublic: any) => {
  store.dispatch(
    setModalData({
      modalVisible: true,
      title: t('LOGOUT'),
      message: t('SURE_LOGOUT'),
      fun: () => {
        NavigationService.reset('Home');
        store.dispatch(clearAuthValues());
        store.dispatch(clearSessionUserValues());
        appsFlyer.logEvent(
          'logout',
          {},
          result => console.log('Appsflyer logout event logged:', result),
          error => console.error('Appsflyer logout event error:', error),
        );
        store
          .dispatch(
            getSessionPublicId({is_logged_in: true, session_id: sessionPublic}),
          )
          .then(res => {
            if (res.payload?.result && !!res.payload?.result?.session) {
              store.dispatch(
                setSessionValues({session: res.payload?.result?.session}),
              );
              _getQuantityCart(
                store.dispatch,
                false,
                null,
                null,
                res.payload?.result?.session,
              );
              store.dispatch(clearQuantityWishlist());
            }
          });
        // }
      },
    }),
  );
};

function Settings(props: any): JSX.Element {
  const {colors} = useTheme();
  const generalStyles = getGeneralStyle(colors);
  const styles = getStyle(colors, generalStyles);
  const {sessionPublic, sessionUser} = useAppSelector(state => state.session);
  const dispatch = useAppDispatch();
  const _setModalData = (customView: React.ReactNode) => {
    dispatch(
      setModalData({
        hideConfirm: true,
        CustomView: customView,
      }),
    );
  };
  return (
    <View style={{paddingTop: 10 * BW(), flex: 1, ...props.style}}>
      {!props?.hideTitle && (
        <Text h2 bold>
          {t('settings')}
        </Text>
      )}
      <View style={[styles.settingsContainer, props.settingsContainerStyle]}>
        {/* <View style={styles.setting}>
          <View style={[styles.row, {marginRight: 10 * BW()}]}>
            <Image
              source={require('../../../assets/icons/location.png')}
              style={styles.icon}
            />
          </View>
          <Button
            title={t('country')}
            icon={require('../../../assets/icons/Arrow.png')}
            style={styles.btn}
            styleIcon={styles.styleIcon}
          />
        </View> */}
        <View style={[styles.setting]}>
          <View style={[styles.row, {marginRight: 10 * BW()}]}>
            <Image
              source={require('../../../assets/icons/global.png')}
              style={styles.icon}
            />
          </View>
          <TouchableOpacity
            style={[styles.btn, {flexDirection: 'row', width: '86%'}]}
            onPress={() => {
              isArabic() ? _setLang('en') : _setLang('ar');
            }}>
            <Text h4>{t('language')}</Text>
            <Text h4>{isArabic() ? 'English' : 'عربي'}</Text>
          </TouchableOpacity>
          {/* <Button
            title={t('language')}
            icon={require('../../../assets/icons/Arrow.png')}
            style={styles.btn}
            styleIcon={styles.styleIcon}
            onPress={() => {
              _setModalData(
                <View style={{height: '100%', flexDirection: 'column'}}>
                  <TouchableOpacity
                    style={{
                      height: 40 * BH(),
                      marginVertical: 8 * BW(),
                      borderBottomWidth: 1,
                      borderBottomColor: colors.gray + 'cc',
                    }}
                    onPress={() => _setLang('en')}>
                    <Text h3 bold>
                      {t('english')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{height: 40 * BH(), marginTop: 8 * BW()}}
                    onPress={() => _setLang('ar')}>
                    <Text h3 bold>
                      {t('arabic')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 4 * BW(),
                      height: 40 * BH(),
                      width: 100 * BW(),
                      borderRadius: 8 * BW(),
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primary,
                    }}
                    onPress={() => dispatch(hideModal())}>
                    <Text h4 style={{color: '#fff'}}>
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>,
              );
            }}
          /> */}
        </View>
        {/* <View style={[styles.setting]}>
          <View style={[styles.row, {marginRight: 10 * BW()}]}>
            <Image
              source={require('../../../assets/icons/shield-security.png')}
              style={styles.icon}
            />
          </View>
          <Button
            title={t('security')}
            icon={require('../../../assets/icons/Arrow.png')}
            style={styles.btn}
            styleIcon={styles.styleIcon}
          />
        </View> */}
        {!props?.geust && (
          <>
            <View style={[styles.setting]}>
              <View style={[styles.row, {marginRight: 10 * BW()}]}>
                <Image
                  source={require('../../../assets/header/out.png')}
                  style={[styles.icon, {height: 15 * BW()}]}
                />
              </View>
              <Button
                title={t('LOGOUT')}
                icon={require('../../../assets/icons/Arrow.png')}
                style={styles.btn}
                styleIcon={styles.styleIcon}
                onPress={() => {
                  _logOut(sessionPublic);
                }}
              />
            </View>

            <View style={styles.setting}>
              <View style={[styles.row, {marginRight: 10 * BW()}]}>
                <Image
                  source={require('../../../assets/icons/shield-security.png')}
                  style={{
                    width: 20 * BW(),
                    height: 20 * BW(),
                    tintColor: '#BABEC1',
                    opacity: 0,
                  }}
                />
              </View>
              <Button
                title={t('DeleteAccount')}
                icon={require('../../../assets/icons/Arrow.png')}
                style={styles.btn}
                styleIcon={styles.styleIcon}
                onPress={() => {
                  NavigationService.navigate('DeleteAccount');
                }}
              />
            </View>
          </>
        )}
      </View>
      {/* <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      paddingHorizontal: 16 * BW(),
                      marginBottom: 10 * BW(),
                    }}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <AntDesign name={'close'} size={22} color={'#A7A7A7'} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                  </ScrollView>
                </View>
              </View>
            </Modal>
            {modalVisible && (
              <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={2}
                reducedTransparencyFallbackColor={'#fff'}
              />
            )} */}
    </View>
  );
}

export default Settings;

const getStyle = (colors: any, generalStyles: any) =>
  StyleSheet.create({
    settingsContainer: {
      backgroundColor: '#fff',
      borderRadius: 15 * BW(),
      marginVertical: 14 * BW(),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    setting: {
      padding: 14 * BW(),
      borderTopColor: '#EFF1F3',
      borderBottomColor: '#EFF1F3',
      borderBottomWidth: 1 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    btn: {
      ...generalStyles.signUp,
      width: '90%',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      borderRadius: 0,
      alignItems: 'center',
    },
    styleIcon: {
      transform: [{rotate: isArabic() ? '180deg' : '0deg'}],
    },
    icon: {
      width: 20 * BW(),
      height: 20 * BW(),
      tintColor: '#BABEC1',
      resizeMode: 'contain',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 8 * BW(),
      paddingVertical: 18 * BW(),
      // alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
      width: '100%',
      height: '60%',
    },
  });
