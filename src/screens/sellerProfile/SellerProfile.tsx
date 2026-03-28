import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { getBaseURL } from '../../redux/network/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import Text from '../../component/Text';
import { quantityItemsInCart } from '../../redux/reducers/cart/thunk/quantityCart';
import { setQuantityValues } from '../../redux/reducers/cart/slice/quantity';
import CustomImage from '../../component/CustomImage';
import Counter from '../products/productdetails/Counter';
import { displayCart } from '../../redux/reducers/cart/thunk/cart';
import { setModalData } from '../../redux/reducers/modal';
import { setCartUpdatedNeeded } from '../../redux/reducers/cart/slice/cart';
import { deleteFromCart } from '../../redux/reducers/cart/thunk/deleteProd';
import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';
import FastImage from 'react-native-fast-image';
import Input from '../../component/Input';
import { discountCode } from '../../redux/reducers/cart/thunk/discountCode';
import { updateLinesInCart } from '../../redux/reducers/cart/thunk/updateLine';
import { isArabic } from '../../locales';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { setWishlistUpdateNeeded } from '../../redux/reducers/wishlist/slice/wishlist';
import { getWishlist } from '../../redux/reducers/wishlist/thunk/wishList';
import { deleteFromWishlist } from '../../redux/reducers/wishlist/thunk/add_delete';
import { setQuantityWishlist } from '../../redux/reducers/wishlist/slice/quantityWishlist';
import { getGeneralStyle } from '../../style/styles';
import { getSellerProfile } from '../../redux/reducers/seller/thunk/sellerProfile';
import FlatListComp from '../../component/FlatList';
import { color } from 'react-native-elements/dist/helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import { onShare } from '../../component/Generalfunction';
import LinearGradient from 'react-native-linear-gradient';
import { Linking } from 'react-native';
import ProductCard from '../home/homepage/ProductCard';

function SellerProfile(props: any): JSX.Element {
  let sellerId = props?.route?.params?.sellerId;
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const _slleronShare = () => {
    let title = isArabic() ? data?.name : data?.name;
    let msg = `${getBaseURL()}${data.seller_url}`;
    onShare({ title, message: msg });
  };
  const _getSellerProfile = () => {
    setLoading(true);
    dispatch(getSellerProfile({ partnerId: sellerId }))
      .then(res => {
        if (res?.payload?.networkSuccess === true && !!res?.payload?.result) {
          setData(res.payload.result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const renderItem = ({ item, index }: { item: any; index: any }) => {
    const productImageFullPath = `${getBaseURL()}${item.img_url_512}`;
    return (
      <ProductCard
        product={item}
        index={index}
        image={productImageFullPath}
        showSeeMore
        style={{
          width: '47%',
          margin: 3 * BW(),
          padding: 5 * BW(),
          backgroundColor: colors.background,
        }}
      />
    );
  };
  useEffect(() => {
    _getSellerProfile();
  }, []);
  const imageFullPath = getBaseURL() + data?.seller_image;
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#c1c1c1ff', '#f0f0f0ff', '#f0f0f0ff', '#f0f0f0ff']}
      locations={[0, 0.181, 0.781, 0.9084]}
    >
      <Header
        searchCenter
        hideDrawer
        showCart
        hideNotification
        hideTitle
        onPress={() => {
          NavigationService.goBack();
        }}
      />
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              styles.btnCotainer,
              {
                position: 'absolute',
                top: 12 * BW(),
                left: 10 * BW(),
                zIndex: 100,
              },
            ]}
            onPress={_slleronShare}
          >
            <Image
              source={require('../../assets/icons/share.png')}
              style={{
                width: 14 * BW(),
                height: 14 * BW(),
                resizeMode: 'contain',
                tintColor: '#fff',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12 * BW(),
            }}
          >
            <CustomImage
              url={imageFullPath}
              style={{
                width: 130 * BW(),
                height: 130 * BW(),
                borderRadius: 8 * BW(),
                resizeMode: 'stretch',
              }}
            />
          </View>
          <View style={styles.btnContainerWithtext}>
            <Text h1 bold style={{ color: colors.goldeText }}>
              {data?.name}
            </Text>
          </View>
          <View>
            <View style={styles.count}>
              <Icon name="shopping-bag" size={14} color="#C79D65" />
              <Text
                h4
                style={{
                  paddingHorizontal: 8,
                }}
              >
                {t('products')}: {data?.count_of_product}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (data?.seller_url) {
                  Linking.openURL(`${getBaseURL()}${data.seller_url}`);
                }
              }}
              style={styles.count}
            >
              <Text
                h4
                bold
                style={{
                  textDecorationLine: 'underline',
                  color: '#6f6f6fff',
                }}
              >
                {t('become a seller')}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text h2 bold style={styles.all}>
              {t('all products')}
            </Text>
          </View>
          <FlatListComp
            data={data?.products || []}
            horizontal={false}
            numColumns={2}
            contentContainerStyle={styles.container}
            keyExtractor={(item: Product) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </LinearGradient>
  );
}
export default SellerProfile;
const getStyle = (colors: any) =>
  StyleSheet.create({
    productContainer: {
      backgroundColor: '#fff',
      width: '100%',
      marginTop: 8 * BW(),
      paddingHorizontal: 12 * BW(),
      paddingVertical: 12 * BW(),
      paddingBottom: 20 * BW(),
    },
    prodImg: {
      width: 95 * BW(),
      height: 130 * BH(),
    },
    delIcon: {
      width: 24 * BW(),
      height: 24 * BH(),
    },
    basePrice: {
      textDecorationLine: 'line-through',
      color: colors.gray,
      marginRight: 5 * BW(),
    },
    priceReduce: {
      color: colors.red,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '80%',
      padding: 20 * BW(),
      backgroundColor: '#fff',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noData: {
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingHorizontal: 20 * BW(),
    },
    noDataIcon: {
      width: 50 * BW(),
      height: 50 * BW(),
      tintColor: colors.gray,
    },
    name: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingTop: 10 * BW(),
      paddingHorizontal: 10 * BW(),
    },
    all: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingTop: 10 * BW(),
      paddingHorizontal: 10 * BW(),
    },
    count: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10 * BW(),
      paddingTop: 10 * BW(),
    },
    btnCotainer: {
      height: 28 * BW(),
      width: 28 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4 * BW(),
      zIndex: 10 * BW(),
      backgroundColor: '#D8B070',
    },
    btnContainerWithtext: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10 * BW(),
    },
    container: {
      gap: 3 * BW(),
      justifyContent: 'space-between',
      marginHorizontal: 8 * BW(),
    },
  });
