import React, { useEffect, useState } from 'react';
import Text from '../../../component/Text';
import { useTheme } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { BH, BW } from '../../../style/theme';
import Input from '../../../component/Input';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { getProductsByAttributes } from '../../../redux/reducers/products/thunk/detailsThunk';
import { getInventoryMsgs } from '../../../redux/reducers/products/thunk/inventoryMsgs';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomImage from '../../../component/CustomImage';
import { getBaseURL } from './../../../redux/network/api';

const circleSize = 22 * BW();
const circleRingSize = 2 * BW();

const defaultVarintsValues = variants => {
  const defaultValues = [];
  variants?.forEach(variant => {
    if (variant?.attribute_values?.length > 0) {
      defaultValues.push(0);
    } else {
      defaultValues.push(null);
    }
  });
  return defaultValues;
};

function ProductVariants(props: any): JSX.Element {
  const {
    data,
    product_id,
    onIsOutOfStock,
    inputValues,
    setInputValues,
    additionalNotes,
    setAdditionalNotes,
    inputEmpty,
    // setMainImage,
    selectedVariantDetails,
    setSelectedVariantDetails,
    isFocused,
  } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = getStyle(colors);
  const dipatch = useAppDispatch();
  const [sizeGuideVisible, setSizeGuideVisible] = useState(false);
  // const [sizeGuideUrl, setSizeGuideUrl] = useState('');
  const [selectedVariants, setSelectedVariants] = useState(() =>
    defaultVarintsValues(data?.product_variants),
  );
  const { prodByAttrId, prodByAttr, loadingDetails } = useAppSelector(
    state => state.productByAttributes,
  );
  const { sessionPublic, sessionUser } = useAppSelector(state => state.session);
  // const {msg, outOfStock, msgLoader} = useAppSelector(
  //   state => state.inventoryMsgs,
  // );
  const price = prodByAttr?.price;
  const basePrice =
    parseFloat(prodByAttr?.product_prices?.base_price)?.toFixed(2) || null;
  const reducePrice = parseFloat(
    prodByAttr?.product_prices?.price_reduce,
  )?.toFixed(2);
  useEffect(() => {
    if (props.onPriceUpdate && reducePrice) {
      props.onPriceUpdate(price, basePrice, reducePrice);
    }
  }, []);
  useEffect(() => {
    if (props.onPriceUpdate && reducePrice) {
      props.onPriceUpdate(price, basePrice, reducePrice);
    }
  }, [price, reducePrice, product_id]);

  const getSelectedVariantDetails = (variants, selectedValues) => {
    return selectedValues.map((valueIndex, variantIndex) => {
      const variant = variants[variantIndex];
      const value = variant.attribute_values[valueIndex];
      return value.variant_id;
    });
  };

  useEffect(() => {
    const details = getSelectedVariantDetails(
      data?.product_variants,
      selectedVariants,
    );
    setSelectedVariantDetails(details);
  }, [selectedVariants]);

  const _getProductsByAttributes = () => {
    dipatch(
      getProductsByAttributes({
        product_template_id: props.product_id,
        attribute_ids: selectedVariantDetails,
        session_id: sessionPublic ? sessionPublic : null,
      }),
    );
  };
  useEffect(() => {
    if (isFocused && product_id) {
      _getProductsByAttributes();
    }
  }, [selectedVariantDetails, product_id, isFocused]);

  const handleVariantSelection = (variantIndex, valueIndex) => {
    const updatedVariants = [...selectedVariants];
    updatedVariants[variantIndex] = valueIndex;
    setSelectedVariants(updatedVariants);
  };
  const [attrSelect, setattrSelect] = useState([]);
  const [attrSelected, setattrSelected] = useState('');
  // const [inputValues, setInputValues] = useState<{ [key: number]: [number, string] }>({});

  useEffect(() => {
    if (
      data &&
      Array.isArray(data?.product_variants) &&
      data?.product_variants.length > 0
    ) {
      let attributeList = [];
      const sizeData = data?.product_variants?.filter(
        item => item?.attribute_type === 'select',
      );
      if (sizeData && sizeData?.length > 0) {
        for (let i = 0; i < sizeData[0]?.attribute_values?.length; i++) {
          attributeList.push({
            label: sizeData[0]?.attribute_values[i]?.name,
            value: sizeData[0]?.attribute_values[i]?.name,
          });
        }
      }
      setattrSelect(attributeList);
    }
  }, [data?.product_variants]);

  const _getInventortMsgs = () => {
    dipatch(
      getInventoryMsgs({
        productId: prodByAttrId,
      }),
    );
  };

  useEffect(() => {
    if (onIsOutOfStock) {
      onIsOutOfStock(prodByAttr?.out_of_stock);
    }
  }, [prodByAttr?.out_of_stock, onIsOutOfStock]);

  const handleInputChange = (id: number, variantId: number, value: string) => {
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [id]: [variantId, value],
    }));
  };

  const getRequiredStatus = (variant: any) => {
    try {
      let status = false;
      inputValues[variant?.attribute_values[0]?.id] != undefined
        ? !!!inputValues[variant?.attribute_values[0]?.id][1]
          ? (status = true)
          : inputEmpty
          ? !!inputValues[variant?.attribute_values[0]?.id][1]
            ? (status = false)
            : (status = true)
          : (status = false)
        : inputEmpty
        ? (status = true)
        : (status = false);
      return status;
    } catch {
      return false;
    }
  };

  return (
    <View style={{ marginTop: 8 * BW() }}>
      {data?.product_variants.map((variant, variantIndex) => (
        <View key={variantIndex}>
          {!variant?.custom_value && (
            <Text h4 bold style={{ marginBottom: 4 * BW() }}>
              {variant?.attribute_name}
            </Text>
          )}
          <View style={styles.group}>
            {!variant?.custom_value &&
              variant?.attribute_type === 'color' &&
              variant?.attribute_values.map((attrColor, index) => {
                const isActive = selectedVariants[variantIndex] === index;
                return (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        handleVariantSelection(variantIndex, index);
                      }}
                    >
                      <View
                        style={[
                          styles.circle,
                          isActive && {
                            // borderColor: attrColor.html_color,
                            borderColor: colors.black,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.circleInside,
                            {
                              backgroundColor:
                                attrColor.html_color === '#FFFFFF'
                                  ? '#F8F7F3'
                                  : attrColor.html_color,
                            },
                          ]}
                        ></View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            {!variant?.custom_value &&
              (variant.attribute_type === 'pills' ||
                variant.attribute_type === 'radio') &&
              variant.attribute_values.map((attrPill, index) => {
                const isActive = selectedVariants[variantIndex] === index;
                return (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() =>
                        handleVariantSelection(variantIndex, index)
                      }
                    >
                      <View
                        style={[
                          styles.pillsContainer,
                          isActive && {
                            backgroundColor: '#3D3D3D',
                            borderWidth: 0,
                          },
                        ]}
                      >
                        <Text
                          h4
                          style={{
                            ...styles.pillValue,
                            ...(isActive ? { color: '#ffffff' } : null),
                          }}
                        >
                          {attrPill.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            {!variant?.custom_value && variant.attribute_type === 'select' && (
              <>
                <Input
                  styleInput={{
                    backgroundColor: 'transparent',
                    borderRadius: 35 * BW(),
                    borderColor: colors.gray + 'cc',
                    borderWidth: 1 * BW(),
                    width: '100%',
                    minWidth: '100%',
                  }}
                  dropdown
                  items={attrSelect}
                  value={attrSelect.length > 0 ? attrSelect[0]?.value : ''}
                  renderItemProps={item => {
                    return (
                      <View
                        style={{
                          paddingVertical: 5 * BW(),
                        }}
                        key={item.value}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setattrSelected(item.value);
                          }}
                          activeOpacity={0.8}
                          style={[
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}
                        >
                          <Text h4>{item.label}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
                {/* {data.size_guide_url && (
                <TouchableOpacity
                  style={styles.sizeGuideBtn}
                  onPress={() => {
                    setSizeGuideUrl(data.size_guide_url);
                    setSizeGuideVisible(true);
                  }}
                >
                  <Text h4 style={{color: colors.primary}}>دليل القياسات</Text>
                </TouchableOpacity>
              )} */}
              </>
            )}

            {variant?.custom_value && (
              <Input
                type="textInput"
                error={null}
                bold
                label={variant?.attribute_name}
                viewStyle={{ width: '100%', marginTop: 4 * BW() }}
                requiredStar
                required={getRequiredStatus(variant)}
                value={inputValues[variant?.attribute_values[0]?.id] || ''}
                onChangeText={text =>
                  handleInputChange(
                    variant?.attribute_values[0]?.id,
                    variant?.attribute_values[0]?.variant_id,
                    text,
                  )
                }
              />
            )}
          </View>
        </View>
      ))}
      {data?.size_guide_url && (
        <TouchableOpacity
          onPress={() => {
            setSizeGuideVisible(true);
          }}
          style={{ marginVertical: 10 }}
        >
          <Text h4 bold>
            {' '}
            {t('size guide')}{' '}
          </Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sizeGuideVisible}
        onRequestClose={() => setSizeGuideVisible(false)}
      >
        {/* <BlurView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          blurType="light"       
          blurAmount={2}        
        > */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#80808089',
          }}
        >
          <View
            style={{
              width: '90%',
              height: '50%',
              backgroundColor: 'white',
              borderRadius: 12 * BW(),
            }}
          >
            <CustomImage
              url={`${getBaseURL()}${data?.size_guide_url}`}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
            <TouchableOpacity
              onPress={() => setSizeGuideVisible(false)}
              style={{
                position: 'absolute',
                top: 10 * BW(),
                right: 10 * BW(),
                backgroundColor: '#3D3D3D',
                padding: 6 * BW(),
                borderRadius: 8 * BW(),
              }}
            >
              <Icon name="times" size={20 * BW()} color={'#ffffffff'} solid />
            </TouchableOpacity>
          </View>
        </View>
        {/* </BlurView> */}
      </Modal>
      {data?.is_custom_products && (
        <View>
          <Input
            type="textInput"
            required={false}
            bold
            label={t('additionalNotes')}
            error={null}
            viewStyle={{ width: '100%', marginTop: 4 * BW() }}
            value={additionalNotes}
            onChangeText={(text: string) => setAdditionalNotes(text)}
          />
        </View>
      )}
      {/* {!!data?.preparation_period && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10 * BW(),
          }}>
          <Text h4 bold>
            {t('فترة التجهيز')}
          </Text>
          <Text h3> {data?.preparation_period} </Text>
        </View>
      )} */}

      {!!prodByAttr?.stock_message && (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2 * BW() }}
        >
          <Image
            source={require('../../../assets/icons/cart-stock.png')}
            style={{
              width: 14 * BW(),
              height: 14 * BW(),
              resizeMode: 'contain',
            }}
          />
          <Text
            h2
            style={{
              color: prodByAttr?.out_of_stock ? '#ff0000cc' : '#AD8C42',
            }}
          >
            {prodByAttr?.stock_message}
          </Text>
        </View>
      )}
      {!!prodByAttr?.cart_added_message && (
        <Text h2 style={{ color: '#AD8C42' }}>
          {prodByAttr?.cart_added_message}
        </Text>
      )}
      {/* {msg !== 'noMsg' && (
        <Text h2 style={{color: outOfStock ? '#ff0000cc' : '#FFB74A'}}>
          {msg}
        </Text>
      )} */}
    </View>
  );
}

export default ProductVariants;
const getStyle = (colors: any) =>
  StyleSheet.create({
    group: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4 * BW(),
      flexWrap: 'wrap',
      marginBottom: 6 * BW(),
    },
    circle: {
      width: circleSize * BW() + circleRingSize * 4,
      height: circleSize * BW() + circleRingSize * 4,
      borderRadius: 15 * BW() + circleRingSize * 4,
      borderWidth: circleRingSize * BW(),
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleInside: {
      width: circleSize * BW(),
      height: circleSize * BW(),
      borderRadius: 20 * BW(),
    },
    pillsContainer: {
      minWidth: 50 * BW(),
      minHeight: 8 * BH(),
      borderRadius: 35 * BW(),
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.gray + 'cc',
      borderWidth: 1 * BW(),
      paddingHorizontal: 6 * BW(),
    },
    pillValue: {
      padding: 6 * BW(),
    },
  });
