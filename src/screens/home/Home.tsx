import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Modal,
  Button,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getUniqueId } from 'react-native-device-info';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import Products from './homepage/Products';
import Categories from './homepage/Categories';
import MainSlider from './homepage/MainSlider';
import { getData } from '../../redux/reducers/home/thunk/homethunk';
import { isArabic } from '../../locales';
import { getBaseURL, URL } from '../../redux/network/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import FeaturedCategories from './homepage/FeaturedCategories';
import FeaturedStores from './homepage/FeaturedStores';
import {
  getSessionId,
  getSessionPublicId,
} from '../../redux/reducers/User/thunk/login';
import { clearAuthValues } from '../../redux/reducers/User/startup';
import { setSessionValues } from '../../redux/reducers/User/session';
import { setSessionUserValues } from '../../redux/reducers/User/session';
import CategAndItsChilds from './homepage/CategAndItsChilds';
import Bloggers from './homepage/Bloggers';
import { setTokenApi } from '../../redux/reducers/Notification/thunk/notification';
// import { AsyncStorage } from 'react-native';
import Text from '../../component/Text';
import { color } from 'react-native-elements/dist/helpers';
import { adsPopup } from '../../redux/reducers/adsPopup/thunk/ads';
import CustomImage from '../../component/CustomImage';
import Offers from './homepage/Offers';
import { quantityItemsInWishlist } from '../../redux/reducers/wishlist/thunk/wishListCount';
import { setQuantityWishlist } from '../../redux/reducers/wishlist/slice/quantityWishlist';
import { displayCart } from '../../redux/reducers/cart/thunk/cart';
import { setOrderValue } from '../../redux/reducers/cart/slice/order';
import NavigationService from '../../naigation/NavigationService';
import { setModalData } from '../../redux/reducers/modal';
import BestDeals from './homepage/BestDeals';
import AllDescounts from './homepage/AllDescounts';
import BestProducts from './homepage/BestProducts';
import AllDiscounts from './homepage/AllDescounts';
import { getNews } from '../../redux/reducers/home/thunk/news';
import NewsTicker from './NewsTicker';
import reactotron from 'reactotron-react-native';
interface HomeData {
  title: string;
  display_title: boolean;
  type: string;
  data: any;
  display_quick_link: boolean;
  link_title: string;
  link: string;
}

function Home(): JSX.Element {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const [data, setData] = useState<HomeData[]>([]);
  const [callNumber, setCallNumber] = useState<number>(1);
  const [scroll, setScroll] = useState(false);
  const dispatch = useAppDispatch();
  const { dataLoader } = useAppSelector(state => state.homeData);
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const { token } = useAppSelector(state => state.tokenNotification);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshWishlist, setRefreshWishlist] = useState(true);
  const { adsData, adsError, adsLoading } = useAppSelector(state => state.ads);
  const { news, newsLoading, newsError } = useAppSelector(state => state.news);
  // ads popup

  const getAdsPopup = () => {
    dispatch(adsPopup()).then(res => {
      if (Object.keys(res.payload?.result?.data).length > 0) {
        setIsModalVisible(true);
      }
    });
  };
  const getLatestNews = () => {
    dispatch(getNews());
  };

  const handleCloseModal = async () => {
    setIsModalVisible(false);
  };

  const getQuantityInWishlist = () => {
    setRefreshWishlist(false);
    if (authenticatedUser) {
      dispatch(
        quantityItemsInWishlist({
          userId: authenticatedUser,
          sessionId: sessionUser ? sessionUser : '',
        }),
      ).then(res => {
        if (
          res?.payload?.result?.type == 'calledSuccessfully' &&
          res?.payload?.result?.data
        ) {
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.data?.count,
            }),
          );
        }
      });
    } else if (!!sessionPublic) {
      dispatch(
        quantityItemsInWishlist({
          sessionId: sessionPublic,
        }),
      ).then(res => {
        if (
          res?.payload?.result?.type == 'calledSuccessfully' &&
          res?.payload?.result?.data?.count
        ) {
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.data?.count,
            }),
          );
        }
      });
    }
  };
  useEffect(() => {
    getAdsPopup();
    getLatestNews();
  }, []);

  // //  notification token api
  // const _setTokenApi = () => {
  //   getUniqueId().then(uniqueId => {
  //     dispatch(
  //       setTokenApi({
  //         data: {
  //           device_id: uniqueId, // Use the resolved uniqueId here
  //           user_id: authenticatedUser ? authenticatedUser : '',
  //           token: token,
  //           topic: isArabic() ? 'user_ar' : 'user_en',
  //           user_lang: isArabic() ? 'ar_001' : 'en_US',
  //         },
  //       }),
  //     );
  //   });
  // };

  useEffect(() => {
    getQuantityInWishlist();
  }, [refreshWishlist]);

  // useFocusEffect(
  //   useCallback(() => {
  //     getQuantityInWishlist();
  //   }, []),
  // );

  //  notification token api

  const _setTokenApi = () => {
    getUniqueId().then(uniqueId => {
      dispatch(
        setTokenApi({
          data: {
            device_id: uniqueId, // Use the resolved uniqueId here
            user_id: authenticatedUser ? authenticatedUser : '',
            token: token,
            topic: isArabic() ? 'user_ar' : 'user_en',
            user_lang: isArabic() ? 'ar_001' : 'en_US',
          },
        }),
      );
    });
  };

  useEffect(() => {
    _setTokenApi();
  }, [authenticatedUser, token]);

  const _getSessionId = () => {
    if (isLoggedIn) {
      if (!sessionUser) {
        dispatch(getSessionId({ is_logged_in: isLoggedIn })).then(res => {
          if (res.payload?.result && !!res.payload?.result?.session) {
            dispatch(
              setSessionUserValues({ session: res.payload?.result?.session }),
            );
          } else {
            dispatch(clearAuthValues());
          }
        });
      }
    } else {
      dispatch(
        getSessionPublicId({ is_logged_in: false, session_id: sessionPublic }),
      ).then(res => {
        if (res.payload?.result && !!res.payload?.result?.session) {
          reactotron.log(
            'expires ',
            new Date().getTime(),
            res.payload?.result?.expires_in * 1000 + new Date().getTime(),
          );
          dispatch(
            setSessionValues({
              session: res.payload?.result?.session,
              expiresIn:
                res.payload?.result?.expires_in * 1000 + new Date().getTime(),
            }),
          );
        }
      });
    }
  };

  useEffect(() => {
    _getSessionId();
  }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [callNumber]);

  // useFocusEffect(
  //   useCallback(()=>{
  //     setCallNumber(1);
  //    fetchData();
  //   }, [callNumber])
  // )

  // useFocusEffect(
  //   useCallback(() => {
  //     setCallNumber(1);
  //   }, []),
  // );
  useEffect(() => {
    fetchData();
  }, [callNumber]);

  const fetchData = async () => {
    let lang = isArabic() ? 'ar_001' : 'en_US';
    try {
      dispatch(
        getData({
          firstLoad: callNumber == 1 ? true : false,
          call_number: callNumber?.toString(),
          lang: lang,
          user_id: isLoggedIn ? authenticatedUser.toString() : null,
        }),
      ).then(res => {
        if (res.meta.requestStatus == 'fulfilled') {
          const response = res?.payload?.result;
          const maxCallNumber = response?.maximum_number_of_calls;
          const fullData: any[] = [...data, ...response?.data];
          if (
            response &&
            response?.status === 'success' &&
            fullData?.length <= response?.count
          ) {
            const newData = response && response.data ? response?.data : [];
            setData(prevData => [...prevData, ...newData]);
            if (callNumber < maxCallNumber) {
              setCallNumber(callNumber + 1);
            }
          }
        }
      });
    } catch (error) {}
  };
  const isCloseToTop = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    return contentOffset.y < 40 * BW();
  };

  const changeScrollVlaue = (nativeEvent: any) => {
    if (isCloseToTop(nativeEvent)) {
      setScroll(false);
    } else {
      setScroll(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!!news && Object.keys(news).length > 0 && <NewsTicker news={news} />}

      <Header
        hideBack
        showLocation
        helloMessageLeft
        logoCenter={true}
        hideDrawer
        hideNotification
        showCart
        showFav
        searchContainer
        showCategories
        coloredLine
        home
        style={{
          backgroundColor: 'transparent',
          position: 'relative',
          // position:
          //   data.length > 0 &&
          //   data?.filter(p => p.type == 'main_slider')?.length == 0 &&
          //   !scroll
          //     ? 'relative'
          //     : 'absolute',
          // zIndex: 10,
          // marginBottom:
          //   data.length > 0 &&
          //   data?.filter(p => p.type == 'main_slider')?.length == 0 &&
          //   !scroll
          //     ? 10 * BW()
          //     : 0,
        }}
      />
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Image
                source={require('../../assets/icons/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate('Shop', {});
                setIsModalVisible(false);
              }}
            >
              <CustomImage
                url={getBaseURL() + adsData?.image}
                resizeMode={'contain'}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Loader isLoading={dataLoader}>
        <View style={styles.appContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  setCallNumber(1);
                  setRefreshWishlist(true);
                }}
              />
            }
            onScroll={({ nativeEvent }) => {
              changeScrollVlaue(nativeEvent);
            }}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                paddingRight: 0,
                gap: 24 * BW(),
              }}
            >
              {data.map((item: HomeData, index: number) => {
                if (
                  item?.type === 'main_slider' &&
                  Array.isArray(item?.data?.slides_data) &&
                  item?.data?.slides_data.length != 0
                ) {
                  return (
                    <Fragment key={index}>
                      <MainSlider mainSliderData={item?.data?.slides_data} />
                    </Fragment>
                  );
                } else if (
                  item?.type === 'categories' &&
                  Array.isArray(item?.data)
                ) {
                  return (
                    <Fragment key={index}>
                      <Categories
                        data={item?.data}
                        baseUrl={URL}
                        isLoading={dataLoader}
                      />
                      {/* <Offers /> */}
                    </Fragment>
                  );
                } else if (
                  item?.type === 'special_categories' &&
                  item?.data !== null
                ) {
                  return <FeaturedCategories data={item?.data} key={index} />;
                } else if (
                  item?.type === 'products' &&
                  Array.isArray(item?.data) &&
                  item?.data?.length != 0
                ) {
                  return <Products data={item} key={index} />;
                } else if (
                  item?.type === 'special_stores' &&
                  Array.isArray(item?.data) &&
                  item?.data?.length != 0
                ) {
                  return <FeaturedStores data={item} key={index} />;
                } else if (
                  item?.type === 'hot_deal_items' &&
                  item?.data !== null &&
                  item?.data?.length != 0
                ) {
                  return <BestDeals data={item} key={index} />;
                } else if (
                  item?.type === 'fashion' &&
                  item?.data?.length != 0
                ) {
                  return <CategAndItsChilds data={item} key={index} />;
                } else if (
                  item?.type === 'bloggers_slider' &&
                  item?.data?.length != 0
                ) {
                  return <Bloggers data={item} key={index} />;
                } else if (
                  item?.type === 'discount_cards' &&
                  item?.data?.length != 0
                ) {
                  return <Offers data={item?.data} key={index} />;
                } else if (
                  item?.type === 'all_discounts' &&
                  item?.data?.length != 0
                ) {
                  return <AllDiscounts data={item?.data} key={index} />;
                } else if (
                  item?.type === 'best_products' &&
                  item?.data?.length != 0
                ) {
                  return <BestProducts data={item} key={index} />;
                }
                return null;
              })}
            </View>
          </ScrollView>
        </View>
      </Loader>
    </View>
  );
}

export default Home;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: '#ffffffff',
    },
    container: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
    text: {
      color: '#FDCCCF',
      fontSize: 32,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    image: {
      width: 300 * BW(),
      height: 450 * BW(),
      resizeMode: 'contain',
      borderRadius: 12 * BW(),
    },
    closeButton: {
      position: 'absolute',
      top: -46 * BW(),
      right: 140 * BW(),
      zIndex: 1,
      backgroundColor: '#ffffff55',
      width: 28 * BW(),
      height: 28 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14 * BW(),
    },
    closeIcon: {
      width: 33 * BW(),
      height: 33 * BW(),
      tintColor: '#fff',
    },
  });

// function getUniqueId() {
//   throw new Error('Function not implemented.');
// }
