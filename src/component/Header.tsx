import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import NavigationService from '../naigation/NavigationService';
import Text from './Text';
import theme, { BH, BW } from '../style/theme';
import { Image } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { clearAuthValues } from '../redux/reducers/User/startup';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { isArabic } from '../locales';
import { _setLang } from '../screens/Lang';
import Button from './Button';
import Input from './Input';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import Search from './Search';
import Location from './Location';
import { getBaseURL } from '../redux/network/api';
import { setModalData } from '../redux/reducers/modal';
import { t } from 'i18next';
import { _logOut } from '../screens/auth/customer/Settings';
import { setQuantityValues } from '../redux/reducers/cart/slice/quantity';
import SliderCategories from '../screens/categories/SliderCategories';
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
// import Voice from '@react-native-voice/voice';

type SectionProps = PropsWithChildren<{
  backgroundColor: string;
  barStyle: string;
}>;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
function MyStatusBar({
  backgroundColor,
  barStyle,
  ...props
}: SectionProps): JSX.Element {
  return (
    <View
      style={[
        {
          height: STATUSBAR_HEIGHT,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <SafeAreaView>
        <StatusBar
          translucent={true}
          backgroundColor={backgroundColor}
          {...props}
        />
      </SafeAreaView>
    </View>
  );
}

export type Props = {
  title?: string;
  onPress?: () => void;
  hideDrawer?: boolean;
  hideBack?: boolean;
  hideNotification?: boolean;
  showFav?: boolean;
  showSerach?: boolean;
  showHome?: boolean;
  showLang?: boolean;
  showLogout?: boolean;
  showLineNews?: boolean;
  style?: object;
  titleContainerStyle?: object;
  titleStyle?: object;
  titleCenterStyle?: object;
  titleCenter?: boolean;
  hideTitle?: boolean;
  searchCenter?: boolean;
  logoLeft?: boolean;
  showCart?: boolean;
  logoCenter?: boolean;
  searchContainer?: boolean;
  showLocation?: boolean;
  blur?: boolean;
  helloMessageLeft?: boolean;
  coloredLine?: boolean;
  home?: boolean;
  // searchValue?: string;
  // setSearchValue?: (text: string) => void;
  // onPressSearchBtn?: () => void;
};

const AnimatedLine = () => {
  return (
    <View
      style={{
        height: 4 * BW(),
        borderRadius: 2 * BW(),
        marginTop: 8 * BW(),
        overflow: 'hidden',
      }}
    >
      <AnimatedLinearGradient
        customColors={['#dab481', '#33b3bc', '#859f8e', '#d2c298']}
        speed={1000}
      />
    </View>
  );
};

const Header: React.FC<Props> = ({
  title,
  onPress,
  style,
  hideDrawer,
  hideBack,
  hideNotification,
  showFav,
  showSerach,
  showHome,
  showLang,
  showLineNews,
  titleContainerStyle,
  titleStyle,
  showLogout,
  titleCenter,
  searchCenter,
  showCart,
  hideTitle,
  logoCenter,
  logoLeft,
  titleCenterStyle,
  searchContainer,
  showLocation,
  blur,
  helloMessageLeft,
  coloredLine,
  home,
  ...props
}): JSX.Element => {
  const handleGoBack = onPress
    ? () => onPress()
    : () => NavigationService.goBack();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dispatch = useAppDispatch();
  const { isLoggedIn, userName } = useAppSelector(store => store.auth);
  const cartQuantity = useAppSelector(state => state.add.cartQuantity);
  const quantityInCart = useAppSelector(state => state.quantity.quantityInCart);
  const quantityInWishlist = useAppSelector(
    state => state.quantityWishlist.quantityInWishlist,
  );
  const nameParts = !!userName ? userName?.split(' ') : [];
  const firstName = nameParts.length != 0 ? nameParts[0] : '';

  // const [isListening, setIsListening] = useState(false);
  // const toggleVoice = async () => {
  //   if (isListening) {
  //     await Voice.stop();
  //     setIsListening(false);
  //   } else {
  //     await Voice.start(isArabic() ? 'ar-SA' : 'en-US');
  //     setIsListening(true);
  //   }
  // };

  // useEffect(() => {
  //   Voice.onSpeechResults = (event) => {
  //     const text = event.value[0];
  //     props.setSearchValue?.(text);
  //   };
  //   Voice.onSpeechError = () => setIsListening(false);

  //   return () => {
  //     Voice.removeAllListeners();
  //     Voice.destroy();
  //   };
  // }, []);

  return (
    <>
      {(props?.statusBar || blur) && (
        <MyStatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
      )}

      {blur &&
        (Platform.OS == 'ios' ? (
          <BlurView
            blurType="light"
            blurAmount={10}
            style={[
              styles.container,
              {
                ...style,
                height: searchContainer ? 190 * BH() : 110 * BH(),
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.container,
              {
                ...style,
                backgroundColor: colors.background,
                opacity: 0.9,
                height: searchContainer ? 160 * BH() : 120 * BH(),
              },
            ]}
          />
        ))}

      <View
        style={[
          styles.container,
          { ...style },
          {
            marginTop: blur
              ? Platform.OS == 'ios'
                ? 50 * BH()
                : STATUSBAR_HEIGHT
              : 0,
          },
        ]}
      >
        {!props?.statusBar && !blur && (
          <View
            style={{
              height:
                Platform.OS == 'ios' ? 50 * BH() : home ? 0 : STATUSBAR_HEIGHT,
              backgroundColor: 'transparent',
            }}
          ></View>
        )}
        <View style={styles.headerContainer}>
          <View style={styles.flexRow}>
            {logoLeft && (
              <View style={{ width: 30 * BW(), height: 30 * BW() }}>
                <Image
                  source={require('../assets/logo/seen.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
            {!hideBack && (
              <Button
                style={styles.backContainer}
                styleIcon={isArabic() ? styles.imageAr : styles.imageEn}
                containerIcon={styles.btn}
                icon={require('../assets/header/Arrow-Icon.png')}
                onPress={handleGoBack}
              />
            )}
            {showFav && (
              <Button
                style={[
                  styles.btnContainerWithBorder,
                  {
                    borderWidth: 0,
                  },
                ]}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                icon={require('../assets/header/heart.png')}
                header
                onPress={() => NavigationService.navigate('Wishlist', {})}
                badgeValue={quantityInWishlist ? quantityInWishlist : false}
              />
            )}
           {searchCenter && (
                <View
                  style={{
                    overflow: 'hidden',
                    height: 40 * BW(),
                    borderRadius: 8 * BW(),
                    borderWidth: 0.5 * BW(),
                    borderColor: colors.border,
                    width: 246 * BW(),
                    marginLeft: 8 * BW(),
                    ...props.searchCenterStyle,
                  }}
                >
                  <Search
                    style={{
                      borderWidth: 0 * BW(),
                      borderColor: colors.border,
                      marginBottom: 0,
                      padding: 0,
                      paddingHorizontal: 0,
                      marginHorizontal: 0 * BW(),
                      height: '100%',
                    }}
                    inputStyle={{
                      height: '100%',
                      borderWidth: 0.5 * BW(),
                      borderRadius: 0,
                      borderLeftWidth: 0,
                    }}
                    viewStyle={{
                      borderWidth: 0 * BW(),
                      borderColor: colors.border,
                      borderLeftWidth: 0,
                    }}
                    onSearch={props?.onSearch}
                    setSearchValue={props?.setSearchValue}
                    searchValue={props?.searchValue}
                    onPressSearchBtn={props?.onPressSearchBtn}
                    autoFocus={true} 
                  />
                </View>
              )}
            {!hideDrawer && (
              <Button
                style={styles.drawerContainer}
                styleIcon={isArabic() ? styles.drawerAr : styles.image}
                containerIcon={styles.btn}
                icon={require('../assets/header/drawer.png')}
              />
            )}
            {!hideTitle && (
              <View
                style={[
                  styles.titleContainer,
                  hideDrawer && { marginLeft: 8 * BW() },
                  { ...titleContainerStyle },
                ]}
              >
                <Text numberOfLines={1} h1 style={styles.title}>
                  {title}
                </Text>
              </View>
            )}
          </View>
          {titleCenter && (
            <View style={[styles.titleCenter, { ...titleCenterStyle }]}>
              <Text
                numberOfLines={1}
                bold={props?.titleCenterBold}
                h1
                style={styles.title}
              >
                {title}
              </Text>
            </View>
          )}

          {logoCenter && (
            <View style={{ width: 30 * BW(), height: 30 * BW() }}>
              <Image
                source={require('../assets/logo/seen.png')}
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            </View>
          )}

          <View style={[styles.flexRow, { justifyContent: 'flex-end' }]}>
            {/* {showLang && (
            <View
              style={[
                styles.btnContainerWithBorder,
                {
                  backgroundColor: colors.primary + '33',
                  borderColor: colors.primary + '33',
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  isArabic() ? _setLang('en') : _setLang('ar');
                }}
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <Text
                  h4
                  style={{
                    color: colors.primary,
                    textAlign: 'center',
                    lineHeight: 16 * BW(),
                    marginTop: isArabic() ? 0 * BW() : -2 * BW(),
                  }}>
                  {isArabic() ? 'En' : 'ع'}
                </Text>
              </TouchableOpacity>
            </View>
          )} */}
            {showLang && (
              <Input
                dropdown
                viewStyle={styles.btnContainerDropDown}
                styleInput={{
                  paddingVertical: 0,
                  marginTop: 0 * BW(),
                  padding: 0 * BW(),
                  minHeight: 40 * BW(),
                  height: 40 * BW(),
                  borderWidth: 0 * BW(),
                  paddingHorizontal: 6 * BW(),
                  backgroundColor: 'transparent',
                }}
                items={[
                  {
                    label: 'عربي',
                    value: 'ar',
                    icon: require('../assets/lang/arabic.png'),
                  },
                  {
                    label: 'English',
                    value: 'en',
                    icon: require('../assets/lang/english.png'),
                  },
                ].filter(p => p.value != (isArabic() ? 'ar' : 'en'))}
                renderLeftIcon={() =>
                  isArabic() ? (
                    <Image
                      source={require('../assets/lang/arabic.png')}
                      style={{
                        width: 20 * BW(),
                        height: 20 * BW(),
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../assets/lang/english.png')}
                      style={{
                        width: 20 * BW(),
                        height: 20 * BW(),
                        resizeMode: 'contain',
                      }}
                    />
                  )
                }
                itemTextStyle={{
                  opacity: 0,
                }}
                placeholderStyle={{
                  opacity: 0,
                }}
                renderItemProps={item => {
                  return (
                    <View
                      style={{
                        paddingVertical: 5 * BW(),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          isArabic() ? _setLang('en') : _setLang('ar');
                        }}
                        activeOpacity={0.8}
                        style={[
                          { alignItems: 'center', justifyContent: 'center' },
                        ]}
                      >
                        <Image
                          source={item.icon}
                          style={{
                            width: 25 * BW(),
                            height: 25 * BW(),
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}
            {/* {showFav && isLoggedIn && (
              <Button
                style={styles.btnContainerWithBorder}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                icon={require('../assets/header/heart.png')}
                onPress={() =>
                  NavigationService.navigate('WebViewScreen', {
                    url: `${BaseURL}/shop/wishlist`,
                  })
                }
              />
            )} */}
            {showCart && (
              <Button
                style={[
                  styles.btnContainerWithBorder,
                  {
                    borderWidth: 0,
                  },
                ]}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                icon={require('../assets/bottomTab/cart.png')}
                header
                onPress={() =>
                  // NavigationService.navigate('WebViewScreen', {
                  //   url: `${BaseURL}/shop/cart`,
                  // })
                  NavigationService.navigate('MyCart', {})
                }
                badgeValue={quantityInCart ? quantityInCart : false}
                // badgeValue={isLoggedIn ? quantityInCart : false}
              />
            )}
            {isLoggedIn && helloMessageLeft && (
              <View
                style={{
                  width: 40 * BW(),
                  height: 40 * BW(),
                  zIndex: 6,
                  marginLeft: 8 * BW(),
                  // borderColor: colors.border,
                  // borderWidth: 0.5 * BW(),
                  // borderRadius: 8 * BW(),
                  marginTop: 0,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 20 * BW(),
                    height: 20 * BW(),
                  }}
                  onPress={() => NavigationService.navigate('Profile')}
                >
                  <Image
                    source={require('../assets/bottomTab/profile.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                      tintColor: '#CE9C56',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            {props?.showShare && (
              <Button
                style={styles.btnContainerWithBorder}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                onPress={() => {
                  props?.onSahre ? props?.onSahre() : {};
                }}
                icon={require('../assets/icons/share.png')}
              />
            )}
            {!hideNotification && (
              <Button
                style={styles.btnContainerWithBorder}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                icon={require('../assets/header/notification.png')}
              />
            )}
            {isLoggedIn && showLogout && (
              <Button
                style={styles.btnContainerWithBorder}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                onPress={() => {
                  _logOut();
                }}
                icon={require('../assets/header/out.png')}
              />
              // <View style={styles.btnContainer}>
              //   <TouchableOpacity
              //     style={styles.btn}
              //     onPress={() => {
              //       NavigationService.reset('Home');
              //       dispatch(clearAuthValues());
              //     }}>
              //     <Image
              //       source={require('../assets/header/out.png')}
              //       style={[
              //         styles.image,
              //         {transform: [{rotate: !isArabic() ? '180deg' : '0deg'}]},
              //       ]}
              //     />
              //   </TouchableOpacity>
              // </View>
            )}
            {showHome && (
              <View style={[styles.btnContainer]}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => NavigationService.reset('Home')}
                >
                  <Image
                    source={require('../assets/header/home.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>
            )}
            {showSerach && (
              <Button
                style={styles.btnContainerWithBorder}
                styleIcon={styles.image}
                containerIcon={styles.btn}
                icon={require('../assets/header/search.png')}
                onPress={() => NavigationService.navigate('SearchScreen')}
              />
            )}

            {/* {!hideBack && (
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handleGoBack()}>
                  <Image
                    source={require('../assets/icons/back.png')}
                    style={[
                      styles.image,
                      {transform: [{rotate: !isArabic() ? '180deg' : '0deg'}]},
                    ]}
                  />
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </View>

        {searchContainer && (
          <View style={{ marginTop: 2 * BW() }}>
            <Search
              style={{
                borderWidth: 0.5 * BW(),
                borderColor: colors.border,
              }}
              searchValue={props.searchValue}
              setSearchValue={props.setSearchValue}
              onPressSearchBtn={props.onPressSearchBtn}
            />
          </View>
        )}
        {coloredLine && <AnimatedLine />}
        {showLocation && (
          <View
            style={{
              marginHorizontal: 16 * BW(),
            }}
          >
            <Location hideSearch {...(isLoggedIn ? { loggedIn: true } : {})} />
          </View>
        )}
      </View>
    </>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: colors.background,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      borderBottomColor: colors.mainBackground,
      borderBottomWidth: 0.6 * BW(),
    },
    height: {
      height: 85 * BH(),
    },
    headerContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      height: 65 * BH(),
      paddingHorizontal: 16 * BW(),
      width: '100%',
    },
    firstItem: {
      paddingTop: 8 * BW(),
      paddingHorizontal: 15 * BW(),
      backgroundColor: colors.background,
      marginTop: -12 * BW(),
    },
    flexRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    title: {},
    btnContainer: {
      width: 40 * BW(),
      height: 40 * BW(),
      zIndex: 6,
      marginLeft: 8 * BW(),
      padding: 5 * BW(),
    },
    drawerContainer: {
      width: 40 * BW(),
      height: 40 * BW(),
      zIndex: 6,
      padding: 7 * BW(),
      paddingLeft: 0,
      borderRadius: 0 * BW(),
    },
    btnContainerWithBorder: {
      width: 40 * BW(),
      height: 40 * BW(),
      zIndex: 6,
      marginLeft: 8 * BW(),
      borderColor: colors.border,
      borderWidth: 0.5 * BW(),
      borderRadius: 8 * BW(),
      marginTop: 0,
      backgroundColor: 'transparent',
    },
    backContainer: {
      width: 40 * BW(),
      height: 40 * BW(),
      zIndex: 6,
      borderColor: colors.border,
      borderWidth: 0.5 * BW(),
      borderRadius: 8 * BW(),
      marginTop: 0,
      backgroundColor: 'transparent',
    },
    btnContainerDropDown: {
      width: 55 * BW(),
      height: 40 * BW(),
      zIndex: 6,
      marginLeft: 8 * BW(),
      borderColor: colors.border,
      borderWidth: 0.5 * BW(),
      borderRadius: 8 * BW(),
      marginTop: 0,
      backgroundColor: 'transparent',
    },
    btn: {
      width: '100%',
      height: '100%',
    },
    image: {
      width: 20 * BW(),
      height: 20 * BW(),
      resizeMode: 'contain',
      tintColor: '#292D32',
      alignSelf: 'center',
    },
    imageAr: {
      width: 15 * BW(),
      height: 15 * BW(),
      resizeMode: 'contain',
      tintColor: '#292D32',
      alignSelf: 'center',
    },
    imageEn: {
      width: 15 * BW(),
      height: 15 * BW(),
      resizeMode: 'contain',
      tintColor: '#292D32',
      alignSelf: 'center',
      transform: [{ rotate: '180deg' }],
    },
    drawerAr: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: '#292D32',
      transform: [{ scaleX: -1 }],
    },
    titleContainer: {
      // flex: 2,
      // alignItems: 'flex-start',
      // marginLeft: 4 * BW(),
    },
    titleCenter: {
      flex: 2,
      alignItems: 'center',
    },
  });

export default Header;
