import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { BW, BH } from '../../../style/theme';
import Text from '../../../component/Text';
import NavigationService from '../../../naigation/NavigationService';
import { URL } from '../../../redux/network/api';
import CustomImage from '../../../component/CustomImage';
import { useTheme } from '@react-navigation/native';
import AddToCartBtn from './AddToCart';
import Skeleton from 'react-native-reanimated-skeleton';
import { isArabic } from '../../../locales';
import { useTranslation } from 'react-i18next';
import { getGeneralStyle } from '../../../style/styles';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
  addToWishlist,
  deleteFromWishlist,
} from '../../../redux/reducers/wishlist/thunk/add_delete';
import { setQuantityWishlist } from '../../../redux/reducers/wishlist/slice/quantityWishlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
function BestProductCard(props: any): JSX.Element {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const dispatch = useAppDispatch();
  const generalStyles = getGeneralStyle(colors);
  const { t } = useTranslation();
  const { product, alternative = false, loading } = props;
  const imageFullPath = URL + product?.img_url_512;
  const productPrices = product?.products_prices;
  const priceDetails = productPrices ? productPrices[product?.id] : null;
  const basePrice = priceDetails ? priceDetails?.base_price?.toFixed(2) : null;
  const priceReduce = priceDetails
    ? priceDetails?.price_reduce?.toFixed(2)
    : null;
  const [isInWishlist, setIsInWishlist] = useState(product?.is_in_wishlist);
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const [wishId, setWishId] = useState(product?.wish_id);
  const toggleWishlist = () => {
    if (isInWishlist) {
      _deleteFromWishlist();
    } else {
      _addToWishlist();
    }
  };
  const _addToWishlist = () => {
    if (authenticatedUser) {
      dispatch(
        addToWishlist({
          user_id: isLoggedIn ? authenticatedUser.toString() : null,
          product_id: product?.id,
          session_id: sessionUser ? sessionUser : '',
          home_page: true,
        }),
      ).then(res => {
        if (
          res.meta.requestStatus == 'fulfilled' &&
          res?.payload?.result?.status == 'success'
        ) {
          setWishId(res?.payload?.result?.wishlist_item_id);
          setIsInWishlist(true);
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.count,
            }),
          );
        }
      });
    } else if (!!sessionPublic) {
      dispatch(
        addToWishlist({
          session_id: sessionPublic ? sessionPublic : '',
          product_id: product?.id,
          home_page: true,
        }),
      ).then(res => {
        if (
          res.meta.requestStatus == 'fulfilled' &&
          res?.payload?.result?.status == 'success'
        ) {
          setWishId(res?.payload?.result?.wishlist_item_id);
          setIsInWishlist(true);
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.count,
            }),
          );
        }
      });
    }
  };
  const _deleteFromWishlist = () => {
    if (authenticatedUser) {
      dispatch(
        deleteFromWishlist({
          user_id: authenticatedUser,
          session_id: sessionUser ? sessionUser : '',
          wish_id: wishId.toString(),
        }),
      ).then(res => {
        if (res?.payload?.result?.type == 'calledSuccessfully') {
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.data?.count,
            }),
          );
          setIsInWishlist(false);
        }
      });
    } else if (!!sessionPublic) {
      dispatch(
        deleteFromWishlist({
          session_id: sessionPublic ? sessionPublic : '',
          wish_id: wishId.toString(),
        }),
      ).then(res => {
        if (res?.payload?.result?.type == 'calledSuccessfully') {
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.data?.count,
            }),
          );

          setIsInWishlist(false);
        }
      });
    }
  };
  return (
    <View style={[styles.productsContainer, { ...props.style }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          alternative
            ? NavigationService.replace('ProductDetails', {
                item: product,
                key: `product-${product.id}`,
              })
            : NavigationService.navigate('ProductDetails', { item: product });
        }}
        style={{ position: 'relative' }}
      >
        <CustomImage url={imageFullPath} style={styles.productImage} />
        <View
          style={{
            position: 'absolute',
            top: 10 * BW(),
            right: 10 * BW(),
            gap: 8 * BW(),
            zIndex: 1000,
          }}
        >
          {!product?.extra_params?.out_of_stock_message &&
            !product?.is_custom_products &&
            !product?.prod_id &&
            !product?.show_options && (
              // <View
              //   style={{
              //     position: 'absolute',
              //     top: 10 * BW(),
              //     right: 10 * BW(),
              //     zIndex: 1000,
              //   }}>
              <AddToCartBtn
                prodId={product?.id}
                home={true}
                bestContainer={true}
              />
              // </View>
            )}
          {product?.show_quick_add && !product?.show_options && (
            //   <View
            //     style={{
            //       position: 'absolute',
            //       top: 10 * BW(),
            //       right: 10 * BW(),
            //       zIndex: 1000,
            //     }}>
            <AddToCartBtn
              prodId={product?.prod_id}
              home={false}
              bestContainer={true}
            />
            //   </View>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: '#ffffffb3',
              width: 28 * BW(),
              height: 28 * BW(),
              borderRadius: 4 * BW(),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4 * BW(),
            }}
            onPress={toggleWishlist}
          >
            {isInWishlist ? (
              <AntDesign name="heart" size={17 * BW()} color="#f00" />
            ) : (
              <AntDesign name="hearto" size={17 * BW()} color="#000" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.productInformation}>
          {product?.extra_params &&
            product?.extra_params?.left_in_stock_message && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2 * BW(),
                }}
              >
                <Image
                  source={require('../../../assets/icons/cart-stock.png')}
                  style={[
                    generalStyles.currencyImage,
                    { tintColor: '#AD8C42' },
                  ]}
                />
                <Text
                  h4
                  style={{ color: '#AD8C42', width: '90%' }}
                  numberOfLines={1}
                >
                  {product?.extra_params?.left_in_stock_message}
                </Text>
              </View>
            )}
          {product?.extra_params &&
            product?.extra_params?.out_of_stock_message && (
              <Text h4 style={{ color: '#ff0000cc' }} numberOfLines={1}>
                {product?.extra_params?.out_of_stock_message}
              </Text>
            )}
          {!product?.extra_params?.left_in_stock_message &&
            !product?.extra_params?.out_of_stock_message && (
              <Text h5 style={styles.productTitle} numberOfLines={1}>
                {product?.name}
              </Text>
            )}

          <View style={styles.productSub}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4 * BW(),
              }}
            >
              {basePrice && parseFloat(basePrice) > parseFloat(priceReduce) ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4 * BW(),
                  }}
                >
                  <Text h4 bold style={styles.basePrice}>
                    {basePrice}
                  </Text>
                  <Text h3 bold style={styles.priceReduce}>
                    {priceReduce}
                  </Text>
                </View>
              ) : (
                <Text h3 bold style={styles.productPrice}>
                  {product.list_price}
                </Text>
              )}
              {isArabic() && product?.currency_symbol == 'ᴁ' && (
                <Image
                  source={require('../../../assets/icons/dirham.png')}
                  style={[
                    generalStyles.currencyImage,
                    !!basePrice &&
                    !!priceReduce &&
                    parseFloat(basePrice) > parseFloat(priceReduce)
                      ? { tintColor: colors.red }
                      : {},
                  ]}
                />
              )}
              {!isArabic() && product?.currency_symbol == 'ᴁ' && (
                <Image
                  source={require('../../../assets/icons/dirham.png')}
                  style={[
                    generalStyles.currencyImage,
                    !!basePrice &&
                    !!priceReduce &&
                    parseFloat(basePrice) > parseFloat(priceReduce)
                      ? { tintColor: colors.red }
                      : {},
                  ]}
                />
              )}
            </View>
            {/* {!!product?.show_options && (
              <TouchableOpacity
                style={{
                  borderWidth: 0.7 * BW(),
                  borderRadius: 6 * BW(),
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 4 * BW(),
                  height: 26 * BH(),
                }}
                onPress={() =>
                  NavigationService.navigate('ProductDetails', {item: product})
                }>
                <Text>{t('seeOptions')}</Text>
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const getStyle = (colors: any) =>
  StyleSheet.create({
    productsContainer: {
      flexDirection: 'column',
      borderRadius: 8 * BW(),
      width: 114 * BW(),
      marginRight: 6 * BW(),
      backgroundColor: colors.background,
      borderWidth: 0.5 * BW(),
      borderColor: colors.border,
    },
    productImage: {
      width: '100%',
      height: 160 * BH(),
      resizeMode: 'cover',
      borderTopLeftRadius: 8 * BW(),
      borderTopRightRadius: 8 * BW(),
    },
    productInformation: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      // gap: 3 * BW(),
      // padding: 3 * BW(),
      paddingHorizontal: 4 * BW(),
      width: 110 * BW(),
    },

    productSub: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    basePrice: {
      textDecorationLine: 'line-through',
      color: colors.gray,
      marginRight: 5,
    },
    priceReduce: {
      color: colors.red,
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 4 * BW(),
    },
    productSectionTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 8 * BW(),
    },
    productCards: {
      position: 'absolute',
      padding: 8 * BW(),
      gap: 4 * BW(),
    },
    card: {
      width: 35 * BW(),
      height: 35 * BH(),
      backgroundColor: '#ffffff9c',
      borderRadius: 4 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardImage: {
      width: 20 * BW(),
      height: 16 * BH(),
    },
  });

export default BestProductCard;
