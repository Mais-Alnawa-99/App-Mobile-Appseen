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
import {getprofileData} from '../../../redux/reducers/User/thunk/profile';
import {getuserCards} from '../../../redux/reducers/User/thunk/userCards';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import Header from '../../../component/Header';
import {reduxStorage, store} from '../../../redux/store';
import {useFocusEffect} from '@react-navigation/native';
import Settings from './Settings';
import LinearGradient from 'react-native-linear-gradient';
import Locations from './Locations';
import NavigationService from '../../../naigation/NavigationService';
import LinearGradientCustom from '../../../component/LinearGradient';
import Loader from '../../../component/Loader';

function Profile(): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {
    profileData,
    dataLoader: profileDataLoader,
    error: profileError,
  } = useAppSelector(state => state.profile);
  const {
    userCards,
    dataLoader: cardsDataLoader,
    error: cardsError,
  } = useAppSelector(state => state.userCards);
  const {authenticatedUser} = useAppSelector(state => state.auth);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getprofileData({userId: authenticatedUser}));
      dispatch(getuserCards({userId: authenticatedUser}));
    }, [dispatch, authenticatedUser]),
  );

  if (profileError || cardsError) {
    return (
      <View>
        <Text>{t('Error loading profile data')}</Text>
      </View>
    );
  }
  const userImg = profileData?.image;
  const imageFullPath = `${getBaseURL()}${userImg}`;
  const getCardImageAndBackground = (label: string) => {
    let imagePath = require('../../../assets/icons/edit.png');
    let backgroundColor = '#FFFFFF';
    switch (label) {
      case 'myOrders':
        imagePath = require('../../../assets/icons/orders.png');
        backgroundColor = '#FEF7EB';
        break;
      case 'myLocations':
        imagePath = require('../../../assets/icons/locations.png');
        backgroundColor = '#EEF1F9';
        break;
      case 'myInvoices':
        imagePath = require('../../../assets/icons/invoice.png');
        backgroundColor = '#F8F7FF';
        break;
      default:
        break;
    }

    return {imagePath, backgroundColor};
  };
  const handleCardPress = (label: string) => {
    if (label === 'myLocations') {
      NavigationService.navigate('Locations', {});
    }
    if (label === 'myOrders') {
      NavigationService.navigate('Orders', {});
    }
    if (label === 'myInvoices') {
      NavigationService.navigate('Invoices', {});
    }

    return undefined;
  };
  return (
    <View style={styles.appContainer}>
      <Header hideDrawer hideNotification showCart showFav />
      <Loader isLoading={profileDataLoader || cardsDataLoader}>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          <LinearGradientCustom style={styles.appContainer}>
            <View style={styles.headContainer}></View>

            <View style={styles.screenContainer}>
              <ImageBackground
                source={require('../../../assets/profileBg/bgProfile.png')}
                style={styles.mainInfoContainer}>
                <View
                  style={{
                    paddingHorizontal: 30 * BW(),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View style={styles.mainInfo}>
                    <Text h2 bold>
                      {profileData?.name}
                    </Text>
                    <Text h3>{profileData?.email}</Text>
                  </View>

                  <Button
                    title={t('edit')}
                    icon={require('../../../assets/icons/edit.png')}
                    style={styles.editBtn}
                    styleIcon={{width: 25 * BW(), height: 25 * BH()}}
                    onPress={() => {
                      NavigationService.navigate('EditProfile', {
                        phoneNumber: profileData?.mobile,
                      });
                    }}
                  />
                </View>
              </ImageBackground>

              <View style={styles.cardsContainer}>
                {userCards &&
                  Object.keys(userCards).length > 0 &&
                  userCards?.map((card, index) => {
                    const {imagePath, backgroundColor} =
                      getCardImageAndBackground(card?.label);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.card, {backgroundColor}]}
                        onPress={() => handleCardPress(card?.label)}>
                        <Text h2 bold>
                          {t(card.label)}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text h2 bold>
                            {card.count}
                          </Text>
                          <View style={styles.cardImageContainer}>
                            <Image
                              source={imagePath}
                              style={styles.cardImage}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>

              <Settings />
            </View>
          </LinearGradientCustom>
        </ScrollView>
      </Loader>
    </View>
  );
}

export default Profile;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      height: '100%',
    },
    headContainer: {
      height: 100 * BH(),
      backgroundColor: colors.softGold,
    },
    screenContainer: {
      flex: 1,
      paddingHorizontal: 16 * BW(),
      // marginBottom: 30 * BW(),
    },
    mainInfoContainer: {
      width: '100%',
      height: 100,
      backgroundColor: colors.softGold + 'cc',
      borderRadius: 15 * BW(),
      top: -50 * BW(),
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: 30 * BW(),
      resizeMode: 'cover',
      overflow: 'hidden',
      // justifyContent: 'center',
    },
    editBtn: {
      borderWidth: 0.5 * BW(),
      borderColor: colors.gray,
      borderRadius: 10 * BW(),
      padding: 10 * BW(),
      flexDirection: 'row-reverse',
      alignItems: 'center',
      height: 'auto',
      backgroundColor: 'transparent',
      width: 'auto',
      gap: 10 * BW(),
    },
    cardsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      top: -16 * BW(),
      flex: 1,
      // height: "60%"
    },
    card: {
      width: '48%',
      marginBottom: 10 * BW(),
      padding: 10 * BW(),
      // backgroundColor: colors.background,
      borderRadius: 15 * BW(),
      // justifyContent: 'center',
      // alignItems: 'center',
      height: 120 * BH(),
      justifyContent: 'space-between',
    },
    cardImageContainer: {
      width: 40 * BW(),
      height: 40 * BW(),
    },
    cardImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageContainer: {
      width: 120 * BW(),
      height: 120 * BW(),
      borderWidth: 1,
      borderColor: colors.gray + 'cc',
      borderRadius: 60 * BW(),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10 * BW(),
      marginVertical: 4 * BW(),
    },
    icon: {
      width: 20 * BW(),
      height: 20 * BW(),
      tintColor: '#CE9C56',
    },
    infoContainer: {
      borderTopColor: colors.gray + 'cc',
      borderTopWidth: 0.6,
      borderBottomColor: colors.gray + 'cc',
      borderBottomWidth: 0.6,
    },
    distances: {
      paddingVertical: 8 * BW(),
      paddingHorizontal: 20 * BW(),
      marginTop: 16 * BW(),
    },
    // editBtn: {
    //   borderColor: colors.textGray + 'cc',
    //   borderWidth: 1,
    //   width: 'auto',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
  });
