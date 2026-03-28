import React, {useEffect, useState} from 'react';
import Header from '../../component/Header';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import reactotron from 'reactotron-react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getProductDetails} from '../../redux/reducers/products/thunk/detailsThunk';
import {isArabic} from '../../locales';
import Text from '../../component/Text';
import {BW, BH} from '../../style/theme';
import Loader from '../../component/Loader';
import {useNavigation, useTheme} from '@react-navigation/native';
import Media from './productdetails/Media';
import MainInfo from './productdetails/MainInfo';
import ProductVariants from './productdetails/ProductVariants';
import RenderHtmlComponent from '../../component/renderHtml/RenderHtml';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import {useTranslation} from 'react-i18next';
import Description from './productdetails/DescriptionSale';
import ProductSeller from './productdetails/ProductSeller';
import Footer from './productdetails/Footer';
import Products from '../home/homepage/Products';
import Reviews from './productdetails/Reviews';
import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';
import {onShare} from '../../component/Generalfunction';
import {getBaseURL, BaseURL} from '../../redux/network/api';
import Error from '../../component/error/Error';
import CustomerReviews from '../products/ratings/CustomerReviews';
import {useIsFocused, useRoute} from '@react-navigation/native';
function ProductDetails(props: any): JSX.Element {
  const route = useRoute();
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const item = props?.route?.params?.item;
  const navigation = useNavigation();
  const {isLoggedIn, authenticatedUser} = useAppSelector(store => store.auth);
  const {sessionPublic, sessionUser} = useAppSelector(state => state.session);
  const [inputValues, setInputValues] = useState<{
    [key: number]: [number, string];
  }>({});
  const {productDetails, loadingDetails} = useAppSelector(
    state => state.productDetails,
  );
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [inputEmpty, setInputEmpty] = useState('');
  const [price, setPrice] = useState(productDetails?.list_price);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  // const [mainImage, setMainImage] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [reducePrice, setReducePrice] = useState<number>(0);
  const [discountpercentage, setDiscountpercentage] = useState<number>(0);

  const [selectedVariantDetails, setSelectedVariantDetails] = useState([]);
  const [prodFocusId, setProdFocusId] = useState('');
  const {prodByAttrId, prodByAttr} = useAppSelector(
    state => state.productByAttributes,
  );
  useEffect(() => {
    const parentNavigator = navigation.getParent();
    parentNavigator?.setOptions({
      tabBarStyle: {display: 'none'},
    });
    return () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          tabBarStyle: {
            padding: 10 * BW(),
            minHeight: Platform.OS == 'android' ? 70 * BH() : 100 * BH(),
            backgroundColor: colors.background,
          },
        });
      }
    };
  }, [navigation]);
  const dispatch = useAppDispatch();

  const mainImage = prodByAttr?.img_url_1920;

  const _getproductDetails = (productId: string) => {
    dispatch(
      getProductDetails({
        product_id: productId,
        lang: isArabic() ? 'ar_001' : 'en_US',
        user_id: authenticatedUser ? authenticatedUser?.toString() : null,
      }),
    );
  };
//   const _getproductDetails = (item: any) => {
//   const productId = item?.id ? item.id : item?.product_template_id;

//   if (!productId) {
//     console.warn('⚠️ No valid product id or product_template_id found!');
//     return;
//   }

//   dispatch(
//     getProductDetails({
//       product_id: productId.toString(),
//       lang: isArabic() ? 'ar_001' : 'en_US',
//       user_id: authenticatedUser ? authenticatedUser.toString() : null,
//     }),
//   );
// };

//   const _getproductDetails = (item: any) => {
//   const productId =item?.id || item?.product_template_id ;

//   if (!productId) {
//     console.warn('No product id available!');
//     return;
//   }

//   dispatch(
//     getProductDetails({
//       product_id: productId.toString(), // الآن مضمون إنها موجودة
//       lang: isArabic() ? 'ar_001' : 'en_US',
//       user_id: authenticatedUser ? authenticatedUser.toString() : null,
//     }),
//   );
// };
  // useEffect(() => {
  //   // setMainImage('');s
  //   _getproductDetails();
  //   if (productDetails?.product_prices?.base_price) {
  //     setBasePrice(productDetails?.product_prices?.base_price);
  //   }
  // }, []);
  useEffect(() => {
    if (isFocused && item?.id) {
      setProdFocusId(item?.id);
      _getproductDetails(item?.id?.toString());
      if (productDetails?.product_prices?.base_price) {
        setBasePrice(productDetails?.product_prices?.base_price);
      }
    }
  }, [isFocused, item?.id, , route.key]);
  const productDescription = isArabic()
    ? productDetails?.description_ar
    : productDetails?.description_en;
  const _onShare = () => {
    let title = isArabic() ? productDetails?.name_ar : productDetails?.name_en;
    let description_sale = isArabic()
      ? productDetails?.description_sale_ar
      : productDetails?.description_sale_en;
    let msg =
      description_sale + '\n' + `${BaseURL}${productDetails.product_url}`;
    onShare({title, message: msg});
  };
  const _slleronShare = () => {
    let title = isArabic() ? productDetails?.name : productDetails?.name;
    let msg =
       `${BaseURL}${productDetails.seller_url}`;
    slleronShare({title, message: msg});
  };
  const [count, setCount] = useState(1);
  const increaseCount = () => {
    if (count < prodByAttr?.avl_qty) {
      setCount(count + 1);
    }
  };
  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const updatePrice = (
    price: number,
    newBasePrice: number | null,
    newReducePrice: number,
    newDiscountpercentage: number | null,
  ) => {
    if (!!newBasePrice) {
      setBasePrice(newBasePrice);
      setReducePrice(newReducePrice);
      setDiscountpercentage(newDiscountpercentage);
    }
    setPrice(price);
  };
  useEffect(() => {
    if (
      productDetails &&
      productDetails.product_prices &&
      typeof productDetails.product_prices.discount_percentage !== 'undefined'
    ) {
      setDiscountpercentage(productDetails.product_prices.discount_percentage);
      setBasePrice(productDetails.product_prices.base_price);
      setReducePrice(productDetails.product_prices.price_reduce);
      setPrice(productDetails.list_price);
    }
  }, [discountpercentage, reducePrice, basePrice]);

  const handleOutOfStocChange = (isOutOfStock: boolean) => {
    setIsOutOfStock(isOutOfStock);
  };

  const areCustomInputsValid = () => {
    if (productDetails?.is_custom_products) {
      return productDetails?.product_variants
        ?.filter(variant => variant.custom_value === true)
        ?.every(variant => {
          const inputId = variant?.attribute_values[0]?.id;
          return (
            inputValues[inputId] &&
            inputValues[inputId].length > 0 &&
            inputValues[inputId][1] &&
            inputValues[inputId][1].length > 0
          );
        });
    }
    return true;
  };

  return (
    <View style={{flex: 1}}>
      <Header
        searchCenter
        hideDrawer
        // showShare

        showCart
        hideNotification
        hideTitle
        // onSahre={_onShare}
        onPress={() => {
          // setMainImage('');
          NavigationService.goBack();
        }}
      />
      <View style={styles.container}>
        <Loader isLoading={loadingDetails}>
          {productDetails && Object.keys(productDetails).length != 0 ? (
            <>
              <ScrollView showsVerticalScrollIndicator={false}>
                {productDetails?.img_url_1920 && (
                  <Media
                    data={productDetails}
                    mainImage={mainImage}
                    onSahre={_onShare}
                    product_id={item?.id?.toString()}
                  />
                )}
                <View style={styles.infoContainer}>
                  <MainInfo
                    data={productDetails}
                    // count={count}
                    price={price}
                    reducePrice={reducePrice}
                    basePrice={basePrice}
                    discountpercentage={discountpercentage}
                    // increaseCount={increaseCount}
                    // decreaseCount={decreaseCount}
                  />
                  {productDetails?.product_variants && (
                    <ProductVariants
                      product_id={item?.id?.toString()}
                      isFocused={isFocused}
                      data={productDetails}
                      onPriceUpdate={updatePrice}
                      onIsOutOfStock={handleOutOfStocChange}
                      inputValues={inputValues}
                      setInputValues={setInputValues}
                      additionalNotes={additionalNotes}
                      setAdditionalNotes={setAdditionalNotes}
                      inputEmpty={inputEmpty}
                      // setMainImage={setMainImage}
                      setSelectedVariantDetails={setSelectedVariantDetails}
                      selectedVariantDetails={selectedVariantDetails}
                    />
                  )}
                </View>
                {productDetails?.marketplace_seller_name && (
                  <ProductSeller 
                    data={productDetails} 
                    onSahre={_slleronShare}
                  />
                )}

                {productDescription && <Description data={productDetails} />}
                {/* {isLoggedIn ? <Reviews prodId={item?.id?.toString()} /> : ''} */}
                {/* <CustomerReviews  prodId={item?.id?.toString()} style={{ height: 'auto' }} /> */}
                {productDetails?.alternative_products?.length > 0 && (
                  <>
                    <View
                      style={{
                        paddingHorizontal: 16 * BW(),
                        marginBottom: 6 * BW(),
                      }}>
                      <Text h1 bold>
                        {t('relatedProducts')}
                      </Text>
                    </View>
                    <Products
                      data={productDetails?.alternative_products}
                      alternative={true}
                    />
                  </>
                )}
              </ScrollView>
              <Footer
                product_id={item?.product_variant_id?.toString()}
                data={productDetails}
                qty={count}
                areCustomInputsValid={areCustomInputsValid}
                inputValues={inputValues}
                additionalNotes={additionalNotes}
                setInputEmpty={setInputEmpty}
                isOutOfStock={isOutOfStock}
                selectedVariantDetails={selectedVariantDetails}
                productTmplId={prodFocusId?.toString()}
                count={count}
                increaseCount={increaseCount}
                decreaseCount={decreaseCount}
              />
            </>
          ) : (
            <Error
              error_connection={true}
              onPressProps={() => _getproductDetails(item?.id?.toString())}
            />
          )}
        </Loader>
      </View>
    </View>
  );
}
export default ProductDetails;

const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
      width: '100%',
    },
    infoContainer: {
      padding: 16 * BW(),
      flex: 1,
    },
    userProfile: {
      backgroundColor: colors.backgroundDark,
      width: 300,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 30 * BW(),
      alignSelf: 'center',
    },
  });
