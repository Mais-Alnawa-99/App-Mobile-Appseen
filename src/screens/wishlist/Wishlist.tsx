import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { getBaseURL } from '../../redux/network/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import Text from '../../component/Text';
import { setModalData } from '../../redux/reducers/modal';
import { getWishlist } from '../../redux/reducers/wishlist/thunk/wishList';
import { deleteFromWishlist } from '../../redux/reducers/wishlist/thunk/add_delete';
import { setQuantityWishlist } from '../../redux/reducers/wishlist/slice/quantityWishlist';
import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';
import { isArabic } from '../../locales';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddToCartBtn from '../home/homepage/AddToCart';
import { getGeneralStyle } from '../../style/styles';
function Wishlist(): JSX.Element {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const { wishlistData, wishlistLoading } = useAppSelector(
    state => state.wishlist,
  );
  const [btnPressed, setBtnPressed] = useState(false);
  // handle wishlist
  const handleWishlist = () => {
    if (authenticatedUser) {
      dispatch(
        getWishlist({
          userId: authenticatedUser,
          sessionId: sessionUser ? sessionUser : '',
        }),
      );
    } else if (sessionPublic) {
      dispatch(
        getWishlist({
          sessionId: sessionPublic?.toString(),
        }),
      );
    } else {
      dispatch(
        setModalData({
          modalVisible: true,
          message: t('noUserOrSessionDataAvailable'),
        }),
      );
    }
  };

  // delete from wishlist
  const deleteWish = (wishId: number) => {
    const payload = authenticatedUser
      ? {
          user_id: authenticatedUser,
          session_id: sessionUser ? sessionUser : '',
          wish_id: wishId.toString(),
        }
      : {
          session_id: sessionPublic ? sessionPublic : '',
          wish_id: wishId.toString(),
        };

    dispatch(deleteFromWishlist(payload)).then(res => {
      if (
        res?.payload?.result?.type === 'calledSuccessfully' &&
        res?.payload?.result?.data
      ) {
        dispatch(
          setQuantityWishlist({
            quantityInWishlist: res?.payload?.result?.data?.count,
          }),
        );
        handleWishlist();
      }
    });
  };

  // focus effect (reload when return to page)
  useFocusEffect(
    useCallback(() => {
      if (sessionPublic || isLoggedIn || btnPressed) {
        handleWishlist();
        setBtnPressed(false);
      }
      return () => {};
    }, [sessionPublic, isLoggedIn, btnPressed]),
  );

  // extra safety: initial load
  useEffect(() => {
    if (sessionPublic || isLoggedIn) {
      handleWishlist();
    }
  }, [sessionPublic, isLoggedIn]);

  // rendering
  if (wishlistLoading) {
    return (
      <View style={styles.center}>
        <Loader isLoading={true} modal={false} size={40} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray + '22' }}>
      <Header hideDrawer title={t('Wishlist')} />

      {!wishlistLoading && wishlistData?.length === 0 && (
        <View style={styles.noData}>
          <Button
            style={{ backgroundColor: 'transparent' }}
            styleIcon={styles.noDataIcon}
            icon={require('../../../src/assets/header/heart.png')}
          />
          <Text h2 style={{ textAlign: 'center', color: colors.gray }}>
            {t('noWishlist')}
          </Text>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              NavigationService.navigate('Shop', {});
            }}
          >
            <Text h3 style={{ color: '#D0B67B' }}>
              {t('showProducts')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {wishlistData?.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleWishlist} />
          }
        >
          {wishlistData.map((prod: any, index: number) => {
            const imageFullPath = getBaseURL() + prod?.image_128;
            const basePrice =
              prod?.product_prices?.base_price?.toFixed(1) || null;
            const reducePrice =
              prod?.product_prices?.price_reduce?.toFixed(1) || null;
            return (
              <View
                key={index}
                style={[styles.productContainer, { flexDirection: 'row' }]}
              >
                <TouchableOpacity
                  onPress={() => {
                    NavigationService.navigate('ProductDetails', {
                      item: { id: prod.product_template_id },
                    });
                  }}
                >
                  <Image
                    source={{ uri: getBaseURL() + prod?.image_128 }}
                    resizeMode="cover"
                    style={styles.prodImg}
                  />
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 12 * BW(), flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      NavigationService.navigate('ProductDetails', {
                        item: { id: prod.product_template_id },
                      });
                    }}
                  >
                    <Text h4 style={{ color: colors.gray }}>
                      {prod?.name}
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" h4 bold>
                      {prod?.description_sale}
                    </Text>
                  </TouchableOpacity>

                  {!!prod?.stock_message && (
                    <View style={styles.stockRow}>
                      <Image
                        source={require('../../assets/icons/cart-stock.png')}
                        style={{ width: 12 * BW(), height: 12 * BW() }}
                      />
                      <Text
                        h3
                        style={{
                          color: prod?.out_of_stock ? '#ff0000cc' : '#AD8C42',
                        }}
                      >
                        {prod?.stock_message}
                      </Text>
                    </View>
                  )}

                  {basePrice &&
                  reducePrice &&
                  parseFloat(basePrice) > parseFloat(reducePrice) ? (
                    <View style={styles.priceRow}>
                      <Text h4 style={styles.basePrice}>
                        {basePrice}
                      </Text>
                      <Text h3 style={styles.priceReduce}>
                        {reducePrice}
                      </Text>
                      {!isArabic() && prod?.currency_symbol === 'ᴁ' && (
                        <Image
                          source={require('../../assets/icons/dirham.png')}
                          style={[
                            generalStyles.currencyImage,
                            { tintColor: 'red' },
                          ]}
                        />
                      )}
                      {isArabic() && prod?.currency_symbol === 'ᴁ' && (
                        <Image
                          source={require('../../assets/icons/dirham.png')}
                          style={[
                            generalStyles.currencyImage,
                            { tintColor: 'red' },
                          ]}
                        />
                      )}
                    </View>
                  ) : (
                    <View style={styles.priceRow}>
                      <Text h3 bold>
                        {prod?.price_unit || basePrice}
                      </Text>
                      {!isArabic() && prod?.currency_symbol === 'ᴁ' && (
                        <Image
                          source={require('../../assets/icons/dirham.png')}
                          style={generalStyles.currencyImage}
                        />
                      )}
                      {isArabic() && prod?.currency_symbol === 'ᴁ' && (
                        <Image
                          source={require('../../assets/icons/dirham.png')}
                          style={generalStyles.currencyImage}
                        />
                      )}
                    </View>
                  )}

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => {
                        deleteWish(prod?.wishlist_id);
                      }}
                    >
                      <AntDesign name="heart" size={18 * BW()} color="#f00" />
                    </TouchableOpacity>
                    {!prod?.out_of_stock && <AddToCartBtn prodId={prod?.id} />}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export default Wishlist;

const getStyle = (colors: any) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productContainer: {
      backgroundColor: '#fff',
      width: '100%',
      marginTop: 8 * BW(),
      paddingHorizontal: 12 * BW(),
      paddingVertical: 12 * BW(),
    },
    prodImg: {
      width: 95 * BW(),
      height: 130 * BH(),
    },
    basePrice: {
      textDecorationLine: 'line-through',
      color: colors.gray,
      marginRight: 5,
    },
    priceReduce: {
      color: colors.red,
    },
    stockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2 * BW(),
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4 * BW(),
      marginTop: 4 * BW(),
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8 * BW(),
    },
    noData: {
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    noDataIcon: {
      width: 50 * BW(),
      height: 50 * BW(),
      tintColor: colors.gray,
    },
  });
