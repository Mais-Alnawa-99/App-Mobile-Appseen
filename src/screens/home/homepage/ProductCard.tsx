import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { BW, BH } from '../../../style/theme';
import Text from '../../../component/Text';
import NavigationService from '../../../naigation/NavigationService';
import { URL } from '../../../redux/network/api';
import CustomImage from '../../../component/CustomImage';
import { useTheme } from '@react-navigation/native';
import AddToCartBtn from './AddToCart';
import { isArabic } from '../../../locales';
import { useTranslation } from 'react-i18next';
import { getGeneralStyle } from '../../../style/styles';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

function ProductCard(props: any): JSX.Element {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const { t } = useTranslation();
  const { product, alternative = false, loading, style, showSeeMore } = props;
  const imageFullPath = URL + product?.img_url_512;
  const productPrices = product?.products_prices;
  const priceDetails = productPrices ? productPrices[product?.id] : null;
  const basePrice = priceDetails ? priceDetails?.base_price?.toFixed(2) : null;
  const priceReduce = priceDetails
    ? priceDetails?.price_reduce?.toFixed(2)
    : null;
  // ----AnimatedSeeMore----
  const AnimatedSeeMore = () => {
    const translateX = useSharedValue(150);
    useEffect(() => {
      translateX.value = withRepeat(
        withSequence(
          withTiming(-150, { duration: 1200, easing: Easing.linear }),
          withDelay(2000, withTiming(150, { duration: 0 })),
        ),
        -1,
      );
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));
    return (
      <View
        style={{
          height: 30 * BW(),
          width: '100%',
          borderRadius: 4 * BW(),
          marginVertical: 4 * BW(),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ff9f01',
        }}
      >
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
            },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={['transparent', '#ffffff99', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 80 * BW(),
              height: '100%',
            }}
          />
        </Animated.View>

        <Text h4 bold style={{ color: '#fff' }}>
          {t('see more')}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.productsContainer, style]}>
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
      >
        <View style={{ position: 'relative' }}>
          <CustomImage url={imageFullPath} style={styles.productImage} />

          {priceDetails?.discount_percentage > 0 && (
            <View
              style={{
                backgroundColor: '#F24C00',
                paddingHorizontal: 10 * BW(),
                paddingVertical: 0 * BH(),
                borderRadius: 50 * BW(),
                position: 'absolute',
                bottom: 6 * BW(),
                left: 6 * BW(),
                // right: isArabic() ? 10 * BW() : undefined,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12 }}>
                {priceDetails?.discount_percentage}% OFF
              </Text>
            </View>
          )}
        </View>
        {/* <CustomImage url={imageFullPath} style={styles.productImage} />
 
        {priceDetails?.discount_percentage > 0 && (
          <View
            style={{
              backgroundColor: '#F24C00',
              paddingHorizontal:10 * BW(),
              paddingVertical: 0 * BW(),
              borderRadius: 50 * BW(),
              alignSelf: 'flex-start',
              position:"absolute",
              // marginTop: 4 * BW(),
            }}>
            <Text style={{color: '#fff', fontSize: 12}}>
              {priceDetails?.discount_percentage}% OFF
            </Text>
          </View>
        )} */}

        {/* <Image
            source={require('../../../assets/media/2.png')}  style={styles.productImage}
          /> */}
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
                <Text h4 style={{ color: '#AD8C42' }} numberOfLines={1}>
                  {product?.extra_params?.left_in_stock_message}
                </Text>
              </View>
            )}
          {/* {product?.extra_params &&
            product?.extra_params?.out_of_stock_message && (
              <Text h4 style={{color: '#ff0000cc'}} numberOfLines={1}>
                {product?.extra_params?.out_of_stock_message}
              </Text>
            )} */}
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
                justifyContent: 'flex-start',
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
                  <Text h5 bold style={styles.basePrice}>
                    {basePrice}
                  </Text>
                  <Text h4 bold style={styles.priceReduce}>
                    {priceReduce}
                  </Text>
                </View>
              ) : (
                <Text h3 bold style={styles.productPrice}>
                  {product.list_price}
                </Text>
              )}
              {!isArabic() && product?.currency_symbol == 'ᴁ' && (
                <Image
                  source={require('../../../assets/icons/dirham.png')}
                  style={[
                    generalStyles.currencyImage,
                    basePrice && parseFloat(basePrice) > parseFloat(priceReduce)
                      ? { tintColor: colors.red }
                      : {},
                  ]}
                />
              )}
              {isArabic() && product?.currency_symbol == 'ᴁ' && (
                <Image
                  source={require('../../../assets/icons/dirham.png')}
                  style={[
                    generalStyles.currencyImage,
                    basePrice && parseFloat(basePrice) > parseFloat(priceReduce)
                      ? { tintColor: colors.red }
                      : {},
                  ]}
                />
              )}
            </View>
            {!product?.extra_params?.out_of_stock_message &&
              !product?.is_custom_products &&
              !product?.prod_id &&
              !product?.show_options && (
                <AddToCartBtn prodId={product?.id} home={true} />
              )}
            {product?.show_quick_add && !product?.show_options && (
              <AddToCartBtn prodId={product?.prod_id} home={false} />
            )}
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
          {showSeeMore && <AnimatedSeeMore />}
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
      width: 160 * BW(),
      marginRight: 6 * BW(),
      backgroundColor: colors.background,
      borderWidth: 0.5 * BW(),
      borderColor: colors.border,
    },
    productImage: {
      width: '100%',
      height: 200 * BH(),
      resizeMode: 'cover',
      borderTopLeftRadius: 8 * BW(),
      borderTopRightRadius: 8 * BW(),
      borderColor: colors.border,
      borderBottomWidth: 0,
      // borderRadius: 8 * BW()
    },
    productInformation: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 3 * BW(),
      padding: 6 * BW(),
      paddingHorizontal: 8 * BW(),
    },

    productSub: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 4 * BW(),
    },
    basePrice: {
      textDecorationLine: 'line-through',
      color: colors.gray,
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

export default ProductCard;
