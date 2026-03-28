import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { getBaseURL } from '../../redux/network/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import Text from '../../component/Text';
import { quantityItemsInCart } from '../../redux/reducers/cart/thunk/quantityCart';
import { setQuantityValues } from '../../redux/reducers/cart/slice/quantity';
import CustomImage from '../../component/CustomImage';
import Counter from '../products/productdetails/Counter';
import AddToCartBtn from '../home/homepage/AddToCart';
import { displayCart } from '../../redux/reducers/cart/thunk/cart';
import { setModalData } from '../../redux/reducers/modal';
import { setCartUpdatedNeeded } from '../../redux/reducers/cart/slice/cart';
import { deleteFromCart } from '../../redux/reducers/cart/thunk/deleteProd';
import Button from '../../component/Button';
import NavigationService from '../../naigation/NavigationService';
import FastImage from '@d11/react-native-fast-image';
import Input from '../../component/Input';
import { discountCode } from '../../redux/reducers/cart/thunk/discountCode';
import { updateLinesInCart } from '../../redux/reducers/cart/thunk/updateLine';
import { isArabic } from '../../locales';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { setOrderValue } from '../../redux/reducers/cart/slice/order';
import { getGeneralStyle } from '../../style/styles';
import appsFlyer from 'react-native-appsflyer';
function Cart(): JSX.Element {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoggedIn, authenticatedUser } = useAppSelector(state => state.auth);
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  const {
    cartData,
    count,
    suggestedProducts,
    orderSummary,
    extraParams,
    CartLoading,
    cartUpdateNeeded,
  } = useAppSelector(state => state.cart);
  const { quantityLoading } = useAppSelector(state => state.updateLine);
  const { success } = useAppSelector(state => state.deleteProd);
  const [btnPressed, setBtnPressed] = useState(false);
  const [discountCode_, setDiscountCode_] = useState('');
  const [discountMsg, setDiscountMsg] = useState('');
  const [orderId_, setOrderId_] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const { successUpdate, cartQuantityUpdate } = useAppSelector(
    state => state.updateLine,
  );
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLineStockMsgs, setUpdateLineStockMsgs] = useState<{
    [key: number]: string;
  }>({});

  const handleCart = () => {
    setDiscountMsg('');
    if (authenticatedUser) {
      dispatch(
        displayCart({
          userId: authenticatedUser,
          sessionId: sessionUser ? sessionUser : '',
        }),
      ).then(ress => {
        if (!!ress.payload?.result?.data?.extra_params?.order_id) {
          dispatch(
            setOrderValue({
              order: ress.payload?.result?.data?.extra_params?.order_id,
            }),
          );
        }
      });
      if (success) {
        dispatch(quantityItemsInCart({ userId: authenticatedUser })).then(
          res => {
            if (
              res.payload?.result &&
              !!res.payload?.result?.data?.cart_quantity
            ) {
              dispatch(
                setQuantityValues({
                  quantityInCart: res.payload?.result?.data?.cart_quantity,
                }),
              );
            }
          },
        );
      }
    } else if (!!sessionPublic) {
      dispatch(
        displayCart({
          sessionId: sessionPublic?.toString(),
        }),
      );
      if (success) {
        dispatch(
          quantityItemsInCart({ sessionId: sessionPublic?.toString() }),
        ).then(res => {
          if (
            res.payload?.result &&
            !!res.payload?.result?.data?.cart_quantity
          ) {
            dispatch(
              setQuantityValues({
                quantityInCart: res.payload?.result?.data?.cart_quantity,
              }),
            );
          }
        });
      }
    } else {
      _setModalData(t('noUserOrSessionDataAvailable'));
    }
  };

  const _setModalData = (msg: string, style?: any) => {
    dispatch(
      setModalData({
        modalVisible: true,
        message: msg,
        customStyle: style,
      }),
    );
  };
  // delete from cart
  const delFromCart = (
    orderId: number,
    lineId: number,
    accessToken: string,
  ) => {
    dispatch(
      updateLinesInCart({ orderId, lineId, accessToken, delet_: true }),
    ).then(res => {
      if (res?.payload?.result?.data?.success) {
        setUpdateSuccess(true);
        // handleCart();
      
        dispatch(setCartUpdatedNeeded(true));
        if (
          res.payload?.result?.data?.cart_quantity ||
          res.payload?.result?.data?.cart_quantity == 0
        ) {
          dispatch(
            setQuantityValues({
              quantityInCart: res.payload?.result?.data?.cart_quantity,
            }),
          );
        }
      }
    });
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     if (sessionPublic || isLoggedIn || btnPressed || updateSuccess) {
  //       handleCart();
  //       // dispatch(setCartUpdatedNeeded(false));
  //       setBtnPressed(false);
  //       setUpdateSuccess(false);
  //     }
  //     return () => {};
  //   }, [sessionPublic, isLoggedIn, btnPressed, updateSuccess]),
  // );
  useFocusEffect(
  useCallback(() => {
    // لما تنفتح الصفحة لأول مرة فقط
    if (sessionPublic || isLoggedIn) {
      handleCart();
    }
    return () => {};
  }, [sessionPublic, isLoggedIn]),
);

  useEffect(() => {
  if (cartUpdateNeeded) {
    handleCart(); 
    dispatch(setCartUpdatedNeeded(false)); 
  }
}, [cartUpdateNeeded]);



  const increaseQuantity = (
    orderId: number,
    lineId: number,
    accessToken: string,
  ) => {
    dispatch(updateLinesInCart({ orderId, lineId, accessToken })).then(res => {
      if (res?.payload?.result?.data?.success) {
        setUpdateSuccess(true);
        //  handleCart();
        appsFlyer.logEvent(
          'add_to_cart',
          {
            order_id: orderId,
            user_type: 'login',
          },
          result => console.log('Appsflyer add_to_cart (guest):', result),
          error => console.error('Appsflyer add_to_cart error:', error),
        );
        dispatch(setCartUpdatedNeeded(true));
        if (res.payload?.result?.data?.cart_quantity) {
          dispatch(
            setQuantityValues({
              quantityInCart: res.payload?.result?.data?.cart_quantity,
            }),
          );
        }
      }
      if (res?.payload?.result?.data?.successIncreaseLine == false) {
        const msg = res?.payload?.result?.msg || '';
        setUpdateLineStockMsgs(prevMsgs => ({
          ...prevMsgs,
          [lineId]: msg,
        }));
      }
    });
  };

  const decreaseQuantity = (
    orderId: number,
    lineId: number,
    accessToken: string,
  ) => {
    dispatch(
      updateLinesInCart({ orderId, lineId, accessToken, remove: true }),
    ).then(res => {
      if (res?.payload?.result?.data?.success) {
        setUpdateSuccess(true);
        // handleCart();
        dispatch(setCartUpdatedNeeded(true));
        setUpdateLineStockMsgs(prevMsgs => {
          const updatedMsgs = { ...prevMsgs };
          delete updatedMsgs[lineId];
          return updatedMsgs;
        });
        if (
          res.payload?.result?.data?.cart_quantity ||
          res.payload?.result?.data?.cart_quantity == 0
        ) {
          dispatch(
            setQuantityValues({
              quantityInCart: res.payload?.result?.data?.cart_quantity,
            }),
          );
        }
      }
    });
  };
  const handleCheckout = () => {
    if (authenticatedUser) {
      NavigationService.navigate('CheckOut', {
        orderId: extraParams?.order_id,
      });
    } else if (!isLoggedIn) {
      NavigationService.navigate('GeustInfo', {
        orderId: extraParams?.order_id,
      });
    }
  };
  const handleApplyCode = async (orderId: string) => {
    dispatch(
      discountCode({
        promoCode: discountCode_,
        orderId,
      }),
    ).then(s => {
      if (s.payload?.result?.data?.successPromo) {
        handleCart();
      } else {
        // _setModalData(s.payload?.result?.msg);
        setDiscountMsg(s.payload?.result?.msg);
      }
    });
    setDiscountCode_('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray + '22' }}>
      <Header hideDrawer title={`${t('Cart')} (${count})`} />
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleCart} />
        }
      >
        {CartLoading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Loader isLoading={CartLoading} modal={true} size={40} />
          </View>
        )}
        {!CartLoading && cartData && cartData?.length === 0 && (
          <View
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: -30 * BW() }}>
              <Image
                source={require('../../assets/icons/illustration.png')}
                style={{
                  width: 200 * BW(),
                  height: 200 * BW(),
                  resizeMode: 'contain',
                  position: 'relative',
                }}
              />
              <FastImage
                source={require('../../assets/icons/cart.gif')}
                style={{
                  width: 160 * BW(),
                  height: 160 * BW(),
                  position: 'absolute',
                  bottom: 20 * BW(),
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View style={{ gap: 8 * BW() }}>
              <Text h3 bold>
                {isArabic()
                  ? 'عربة التسوق الخاصة بك فارغة'
                  : 'Your Shopping Cart Is Empty'}
              </Text>
              <Button
                h3
                style={{
                  backgroundColor: colors.primary,
                  height: 40 * BH(),
                  paddingVertical: 4 * BW(),
                }}
                styleText={{ color: '#fff' }}
                title={t('continueShopping')}
                onPress={() => {
                  NavigationService.navigate('Home', {});
                }}
              />
              <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  NavigationService.navigate('Home', {});
                }}
              >
                <Text h3 style={{ color: '#D0B67B' }}>
                  {t('backToHomePage')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {cartData &&
          cartData?.length > 0 &&
          cartData?.map((prod: any, index: number) => {
            const imageFullPath = getBaseURL() + prod?.image_128;
            const attributesString = Object.entries(
              prod?.product_template_attribute,
            );
            const productId = index;
            // const localCount = quantities[productId] || prod?.quantity;
            const basePrice = prod?.product_prices?.base_price || null;
            const reducePrice = prod?.product_prices?.price_reduce || null;

            return (
              <View
                key={index}
                style={[styles.productContainer, { flexDirection: 'row' }]}
              >
                <TouchableOpacity
                  onPress={() =>
                    NavigationService.navigate('ProductDetails', { item: prod })
                  }
                >
                  <CustomImage
                    url={imageFullPath}
                    resizeMode={'cover'}
                    style={styles.prodImg}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    paddingHorizontal: 12 * BW(),
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      NavigationService.navigate('ProductDetails', {
                        item: prod,
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 8 * BW(),
                      }}
                    >
                      <Text h4 style={{ color: colors.gray }}>
                        {prod?.product_template_name}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} ellipsizeMode="tail" h4 bold>
                        {prod?.description_sale}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {attributesString &&
                    Array.isArray(attributesString) &&
                    attributesString.length > 0 && (
                      <Text h4 style={{ color: colors.gray }}>
                        {attributesString
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(',')}
                      </Text>
                    )}
                  {Object.entries(
                    prod?.product_template_attributes_obj_custom,
                  ).map(([key, value], index) => (
                    <View key={index} style={{ flexDirection: 'row' }}>
                      <Text h4 style={{ color: colors.gray }}>
                        {value}
                      </Text>
                    </View>
                  ))}
                  {!!prod?.additional_notes && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text h4>
                        {t('additionalNotes')} : {prod?.additional_notes}
                      </Text>
                    </View>
                  )}
                  {prod?.stock_message && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2 * BW(),
                      }}
                    >
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
                  <Counter
                    count={prod?.quantity}
                    increaseCount={() =>
                      increaseQuantity(
                        extraParams?.order_id,
                        prod?.order_line,
                        extraParams?.access_token,
                      )
                    }
                    decreaseCount={() =>
                      decreaseQuantity(
                        extraParams?.order_id,
                        prod?.order_line,
                        extraParams?.access_token,
                      )
                    }
                    cart
                  />
                  {!!updateLineStockMsgs[prod?.order_line] && (
                    <Text h4 style={{ color: '#ff0000cc' }}>
                      {updateLineStockMsgs[prod?.order_line]}
                    </Text>
                  )}
                  {!!prod?.seller_delivery_message && (
                    <View>
                      <Text h4 style={{ color: '#cba84b' }}>
                        {prod?.seller_delivery_message}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 8 * BW(),
                    }}
                  >
                    {prod?.discount &&
                    !!basePrice &&
                    !!reducePrice &&
                    !!prod?.price_unit &&
                    parseFloat(basePrice) > parseFloat(reducePrice) ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4 * BW(),
                        }}
                      >
                        <Text h4 style={styles.basePrice}>
                          {basePrice}
                        </Text>

                        <Text h3 style={styles.priceReduce}>
                          {reducePrice}
                        </Text>

                        {isArabic() && prod?.currency_symbol == 'ᴁ' && (
                          <Image
                            source={require('../../assets/icons/dirham.png')}
                            style={[
                              generalStyles.currencyImage,
                              prod?.discount ? { tintColor: colors.red } : null,
                            ]}
                          />
                        )}

                        {!isArabic() && prod?.currency_symbol == 'ᴁ' && (
                          <Image
                            source={require('../../assets/icons/dirham.png')}
                            style={[
                              generalStyles.currencyImage,
                              prod?.discount ? { tintColor: colors.red } : null,
                            ]}
                          />
                        )}
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4 * BW(),
                        }}
                      >
                        <Text h1 bold>
                          {prod?.price_unit}
                        </Text>
                        {!isArabic() && prod?.currency_symbol == 'ᴁ' && (
                          <Image
                            source={require('../../assets/icons/dirham.png')}
                            style={generalStyles.currencyImage}
                          />
                        )}
                        {isArabic() && prod?.currency_symbol == 'ᴁ' && (
                          <Image
                            source={require('../../assets/icons/dirham.png')}
                            style={generalStyles.currencyImage}
                          />
                        )}
                      </View>
                    )}
                    {prod?.is_gift ? (
                      <AntDesign name={'gift'} size={20 * BW()} color={'red'} />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          delFromCart(
                            extraParams?.order_id,
                            prod?.order_line,
                            extraParams?.access_token,
                          );
                        }}
                      >
                        <Image
                          source={require('../../assets/icons/del.png')}
                          style={[styles.delIcon, { tintColor: 'red' }]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        {suggestedProducts &&
          Array.isArray(suggestedProducts) &&
          suggestedProducts?.length > 0 && (
            <View style={styles.productContainer}>
              <Text h2 bold>
                {t('suggestedProducts')}
              </Text>
              {suggestedProducts.map((product, indx) => {
                const imageFullPath = getBaseURL() + product?.image_128;
                const basePrice = product?.product_prices?.base_price || null;
                const reducePrice =
                  product?.product_prices?.price_reduce || null;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      NavigationService.navigate('ProductDetails', {
                        item: { id: product.product_tmpl_id },
                      });
                    }}
                  >
                    <View
                      key={indx}
                      style={[
                        {
                          marginTop: 8 * BW(),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        },
                      ]}
                    >
                      <CustomImage
                        url={imageFullPath}
                        resizeMode={'cover'}
                        style={[styles.prodImg]}
                      />
                      <View
                        style={{
                          paddingHorizontal: 12 * BW(),
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text h4 style={{ color: colors.gray }}>
                          {product?.display_name}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" h4 bold>
                          {product?.description_sale}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 8 * BW(),
                          }}
                        >
                          {!!basePrice &&
                          !!reducePrice &&
                          parseFloat(basePrice) > parseFloat(reducePrice) ? (
                            // حالة فيها خصم
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4 * BW(),
                              }}
                            >
                              <Text h4 style={styles.basePrice}>
                                {basePrice}
                              </Text>
                              <Text h3 style={styles.priceReduce}>
                                {reducePrice}
                              </Text>
                              <Image
                                source={require('../../assets/icons/dirham.png')}
                                style={{
                                  width: 16,
                                  height: 16,
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                          ) : (
                            // حالة بدون خصم
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4 * BW(),
                              }}
                            >
                              <Text h1 bold>
                                {product?.price}
                              </Text>
                              <Image
                                source={require('../../assets/icons/dirham.png')}
                                style={{
                                  width: 16,
                                  height: 16,
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                          )}

                          {!product?.is_custom_products && (
                          <AddToCartBtn prodId={product?.id}/>

                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        {!!orderSummary && Object.keys(orderSummary).length > 0 && (
          <View style={styles.productContainer}>
            <Text h2 bold>
              {t('orderSummury')}
            </Text>
            <View style={{ gap: 4 * BW() }}>
              {Object.keys(orderSummary).map(key => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text h4 key={key}>
                    {t(key)}:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4 * BW(),
                    }}
                  >
                    <Text h4>
                      {orderSummary[key] % 1 !== 0
                        ? orderSummary[key]
                        : orderSummary[key]}{' '}
                    </Text>
                    {!isArabic() &&
                      extraParams?.currency_symbol == 'ᴁ' &&
                      key !== 'currency' && (
                        <Image
                          source={require('../../assets/icons/dirham.png')}
                          style={[
                            generalStyles.currencyImage,
                            { width: 12 * BW(), height: 12 * BW() },
                          ]}
                        />
                      )}

                    {isArabic() &&
                      extraParams?.currency_symbol == 'ᴁ' &&
                      key !== 'currency' && (
                        <Image
                          source={require('../../assets/icons/dirham.png')}
                          style={[
                            generalStyles.currencyImage,
                            { width: 12 * BW(), height: 12 * BW() },
                          ]}
                        />
                      )}
                  </View>
                </View>
              ))}
            </View>
            <View style={{ gap: 8 * BW(), marginTop: 8 * BW() }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Input
                  label={isArabic() ? 'كود الخصم' : 'Discount Code'}
                  placeholder={
                    isArabic()
                      ? '  يرجى ادخال كود الخصم  '
                      : 'Enter your discount code'
                  }
                  value={discountCode_}
                  onChangeText={text => setDiscountCode_(text)}
                  type="textInput"
                  required={false}
                  error={null}
                  viewStyle={{ width: '84%' }}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleApplyCode(extraParams?.order_id);
                  }}
                  disabled={loadingCode || discountCode_.trim() === ''}
                  style={{
                    marginTop: 38 * BW(),
                    backgroundColor: colors.primary,
                    height: 36 * BW(),
                    paddingVertical: 2 * BW(),
                    paddingHorizontal: 8 * BW(),
                    borderRadius: 4 * BW(),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text h4 style={{ color: '#fff' }}>
                    {t('apply')}
                  </Text>
                </TouchableOpacity>
              </View>
              {!!discountMsg && (
                <Text h3 style={{ color: '#ff0000' }}>
                  {discountMsg}
                </Text>
              )}

              {extraParams?.reward_exist && (
                <Text h3 bold style={{ color: '#2a8f2abf' }}>
                  {extraParams?.promo_msg}
                </Text>
              )}
              <Button
                h3
                style={{ backgroundColor: colors.primary, height: 'auto' }}
                styleText={{ color: '#fff' }}
                title={
                  isLoggedIn || true ? t('proceedToCheckout') : t('signIn')
                }
                onPress={handleCheckout}
              />
              <Button
                h3
                style={{
                  borderWidth: 0.5 * BW(),
                  borderColor: colors.gray + 'cc',
                  height: 'auto',
                }}
                title={t('continueShopping')}
                onPress={() => {
                  NavigationService.navigate('Home', {});
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
export default Cart;

const getStyle = (colors: any) =>
  StyleSheet.create({
    productContainer: {
      backgroundColor: '#fff',
      width: '100%',
      marginTop: 8 * BW(),
      paddingHorizontal: 12 * BW(),
      paddingVertical: 12 * BW(),
      paddingBottom: 20 * BW(),
      // minHeight: 50 * BW(),
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
      marginRight: 5,
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
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
