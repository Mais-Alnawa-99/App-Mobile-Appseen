import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native';
import Header from '../../component/Header';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useTheme } from '@react-navigation/native';
import Text from '../../component/Text';
import { BW, BH } from '../../style/theme';
import { getShop } from '../../redux/reducers/shop/thunk/shop';
import Loader from '../../component/Loader';
import FlatListComp from '../../component/FlatList';
import Button from '../../component/Button';
import { useTranslation } from 'react-i18next';
import ProductCard from '../home/homepage/ProductCard';
import { spacing } from '../../style/theme';
import { getproductsAttributes } from '../../redux/reducers/shop/thunk/attributes';
import { getproductsAttributeData } from '../../redux/reducers/shop/thunk/attributeData';
import CustomSlider from '../../component/CustomSlider';
import { isArabic } from '../../locales';
import { number } from 'yup';
import Skeleton from 'react-native-reanimated-skeleton';

interface Product {
  name: string;
  id: number;
  description_sale: string;
  list_price: number;
  marketplace_seller_id: string;
  brand_id: string;
  product_variant_count: number;
  rating_avg: number;
  currency_id: string;
  allow_out_of_stock_order: boolean;
  product_variant_id: number;
  img_url_512: string;
  img_url_256: string;
  img_url_128: string;
}

const Shop = (props: any): JSX.Element => {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const searchString = props?.route?.params?.searchString;
  const categoryId = props?.route?.params?.cat_id;
  const loyalty_program_id = props?.route?.params?.loyalty_program_id;
  const product_pricelist_item_id =
    props?.route?.params?.product_pricelist_item_id;
  const withChild = props?.route?.params?.with_child;
  const discount = props?.route?.params?.discount;
  const [loyaltyProgramId, setLoyaltyProgramId] = useState(loyalty_program_id);
  const [productPricelistItemId, setProductPricelistItemId] = useState(
    product_pricelist_item_id,
  );
  const { limit, count, childCategs, searchError, searchLoading } =
    useAppSelector(state => state?.shop);
  const [searchResult, setSearchResult] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [attrIds, setAttrIds] = useState<number[]>([]);
  const [discountRoute, setDiscountRoute] = useState(discount);
  const { data, minPrice, maxPrice, dataLoader, error } = useAppSelector(
    state => state?.attributes,
  );
  const [openAccordion, setOpenAccordion] = useState(null);
  const [seeAll, setSeeAll] = useState(false);
  const { attributeData, attrDataLoader } = useAppSelector(
    state => state?.attributeData,
  );
  const [minPriceFilter, setMinPriceFilter] = useState(minPrice);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: number[];
  }>({});
  const [modalType, setModalType] = useState('');
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState(false);
  const [currentminPriceFilter, setCurrentminPriceFilter] = useState(minPrice);
  const [scroll, setScroll] = useState(false);
  const [categryId_, setcategryId_] = useState(categoryId);
  const _getShopResult = (
    offset: number,
    cat_id: number | null = null,
    filter_ = false,
    minPrice: number | null = null,
    attrValues: { [key: string]: number[] } | null = null,
    order: string | undefined = undefined,
    loyalty_program_id: null,
    product_pricelist_item_id: null,
    with_child = false,
    search_string = '',
    discount: null,
  ) => {
    const filteredAttributes = attrValues ? filterAttributes(attrValues) : null;
    if (offset === 0) {
      setSearchResult([]);
      setLoading(true);
    }
    if (offset <= count) {
      const requestPayload: any = {
        search: searchString,
        limit,
        offset,
        cat_id: cat_id,
        filter_: filter_ ? filter_ : false,
        minPrice: minPrice ? minPrice : undefined,
        attrValues: filteredAttributes,
        loyalty_program_id: loyaltyProgramId ? loyaltyProgramId : null,
        product_pricelist_item_id: productPricelistItemId
          ? productPricelistItemId
          : null,
        with_child: withChild,
        discount: discountRoute ? discountRoute : null,
      };
      if (order) {
        requestPayload.order = order;
      }
      dispatch(getShop(requestPayload))
        .unwrap()
        .then((response: any) => {
          if (
            response &&
            response?.result &&
            Array.isArray(response?.result?.data)
          ) {
            setSearchResult(prevResults => [
              ...prevResults,
              ...response?.result?.data,
            ]);
          } else {
            console.error('Unexpected response structure:', response);
          }
        })
        .catch(error => {
          console.error('Failed to fetch data: ', error);
        })
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    }
  };

  useEffect(() => {
    _getShopResult(
      offset,
      categryId_,
      false,
      null,
      null,
      undefined,
      null,
      null,
      withChild,
      searchString,
    );
  }, []);

  useEffect(() => {
    getAttributes();
  }, [attrIds]);

  const fetchMoreData = () => {
    const newOffset = offset + limit;
    if (newOffset <= count) {
      setOffset(newOffset);
      setLoadingMore(true);
      _getShopResult(
        newOffset,
        categryId_,
        currentFilter,
        currentminPriceFilter,
        selectedAttributes,
        sortOption,
        loyaltyProgramId,
        productPricelistItemId,
        withChild,
        searchString,
        discountRoute,
      );
    }
  };

  const renderItem = ({ item, index }: { item: any; index: any }) => {
    const even = index % 2 == 0;
    return (
      <ProductCard
        product={item}
        index={index}
        style={{
          // marginLeft: !even ? spacing.l / 4 : 0,
          // marginRight: even ? spacing.l / 4 : 0,
          width: 176 * BW(),
          marginTop: 8 * BH(),
        }}
        loading={loading}
      />
    );
  };

  const renderChildCategs = ({ item, index }: { item: any; index: any }) => {
    return (
      <>
        <TouchableOpacity
          style={styles.childCategsBtn}
          onPress={() => getChildCategsFilter(item?.id)}
        >
          <Text h3>{item?.name}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: 2 }).map((_, index) => {
          const even = index % 2 === 0;
          return (
            <Skeleton
              key={`skeleton-${index}`}
              containerStyle={{
                flexDirection: 'column',
                borderRadius: 8 * BW(),
                backgroundColor: colors.background,
                borderWidth: 0.3 * BW(),
                borderColor: colors.border,
                marginLeft: !even ? spacing.l / 4 : 0,
                marginRight: even ? spacing.l / 4 : 0,
                width: 170 * BW(),
                marginTop: even ? spacing.l / 1.8 : 8,
              }}
              isLoading={true}
              layout={[
                {
                  key: 'productContainer',
                  width: '100%',
                  height: 190 * BH(),
                },
                {
                  key: 'prodInfo',
                  padding: 6 * BW(),
                  paddingHorizontal: 8 * BW(),
                  children: [
                    {
                      key: 'productName',
                      width: 100 * BW(),
                      height: 8 * BW(),
                      marginBottom: 2 * BW(),
                    },
                    {
                      key: 'rowContainer',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      children: [
                        {
                          key: 'catName',
                          width: 60 * BW(),
                          height: 10 * BW(),
                        },
                        {
                          key: 'cart',
                          width: 35 * BW(),
                          height: 35 * BH(),
                        },
                      ],
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    );
    // <Loader isLoading={loadingMore}></Loader>;
  };

  // Get All Attributes
  const getAttributes = () => {
    dispatch(getproductsAttributes({ attr_ids: attrIds }));
  };

  // Open & Close Accordion & Fetch Attribute Data
  const handleAccordionPress = attrId => {
    if (openAccordion === attrId) {
      setOpenAccordion(null);
      return;
    }
    setOpenAccordion(attrId);
    if (!attributeData[attrId]) {
      dispatch(getproductsAttributeData({ attrId }));
    }
  };

  // Toggle Selected Attribute
  const handleSelectedAttributes = (id: string, value: number) => {
    setAttrIds(prevAttrIds => {
      const isSelected = prevAttrIds.includes(value);
      if (isSelected) {
        return prevAttrIds.filter(item => item !== value);
      } else {
        return [...prevAttrIds, value];
      }
    });

    setSelectedAttributes(prev => {
      const currentSelection = prev[id] || [];
      const isSelected = currentSelection.includes(value);
      const updatedSelection = isSelected
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value];
      return {
        ...prev,
        [id]: updatedSelection,
      };
    });
  };

  // Delete Keys With Empty Value
  const filterAttributes = (attributes: any) => {
    return Object.keys(attributes)
      .filter(key => attributes[key].length > 0)
      .reduce((obj, key) => {
        obj[key] = attributes[key];
        return obj;
      }, {});
  };

  // Get Selected Count
  const getSelectedCount = (id: number) => {
    return selectedAttributes[id]?.length || 0;
  };

  // Return The Filter Result
  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0) {
      setOffset(0);
      setCurrentFilter(true);
      _getShopResult(
        0,
        categryId_,
        true,
        currentminPriceFilter,
        selectedAttributes,
        undefined,
        loyaltyProgramId,
        productPricelistItemId,
        discountRoute,
      );
    }
  }, [selectedAttributes]);

  //Reset Filter
  const resetFilters = () => {
    setSelectedAttributes({});
    setOffset(0);
    setMinPriceFilter(minPrice);
    _getShopResult(
      0,
      categryId_,
      true,
      minPrice,
      {},
      undefined,
      loyaltyProgramId,
      productPricelistItemId,
      discountRoute,
    );
  };

  // Return Sort Result
  useEffect(() => {
    if (!!sortOption) {
      setOffset(0);
      _getShopResult(
        0,
        categryId_,
        currentFilter,
        currentminPriceFilter,
        selectedAttributes,
        sortOption,
        loyaltyProgramId,
        productPricelistItemId,
        discountRoute,
      );
    }
  }, [sortOption]);

  const openModalWithType = (type: string) => {
    setModalType(type);
    setOpenModal(true);
  };

  const renderModal = () => {
    useEffect(() => {
      if (openModal && modalType === 'filter' && !data) {
        getAttributes();
      }
    }, [openModal, modalType]);

    useEffect(() => {
      setSelectedSortOption(sortOption);
    }, [sortOption]);

    const [selectedSortOption, setSelectedSortOption] = useState(sortOption);
    useEffect(() => {
      if (sortOption) {
        setSelectedSortOption(sortOption);
      } else {
        setSelectedSortOption('website_sequence asc');
      }
    }, [sortOption]);

    const options = [
      { key: 'website_sequence asc', label: t('sortByFeatured') },
      { key: 'create_date desc', label: t('sortByNewest') },
      { key: 'name asc', label: t('sortByName') },
      { key: 'list_price asc', label: t('sortByPriceLH') },
      { key: 'list_price desc', label: t('sortByPriceHL') },
    ];

    return (
      <Modal
        visible={openModal}
        animationType={modalType === 'sort' ? 'slide' : 'slide'}
        transparent={true}
        onRequestClose={() => {
          setOpenModal(false);
        }}
      >
        <View
          style={
            modalType === 'sort'
              ? styles.sortModalContainer
              : styles.modalContainer
          }
        >
          <View
            style={
              modalType === 'sort'
                ? styles.sortModalContent
                : styles.modalContentContainer
            }
          >
            <View style={styles.modalHeader}>
              <Button
                style={styles.closeModal}
                styleIcon={{
                  width: 36 * BW(),
                  height: 36 * BW(),
                  tintColor: colors.primaryColor,
                }}
                onPress={() => setOpenModal(false)}
                icon={require('../../assets/icons/close.png')}
              />
              <Text h3 bold>
                {modalType === 'filter' ? t('filters') : t('sortOptions')}
              </Text>
            </View>
            {modalType === 'filter' ? (
              <Loader isLoading={dataLoader && openAccordion !== null}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text
                    h4
                    bold
                    style={{
                      paddingVertical: 14 * BW(),
                      paddingHorizontal: 8 * BW(),
                    }}
                  >
                    {t('priceRange')}
                  </Text>
                  <View style={styles.priceRangeContainer}>
                    <Text h4 bold>
                      {minPriceFilter}
                    </Text>
                    <CustomSlider
                      style={{ width: '82%' }}
                      minimumValue={minPrice}
                      maximumValue={maxPrice}
                      minimumTrackTintColor="#c5bfbf5e"
                      maximumTrackTintColor="#000000"
                      value={minPriceFilter}
                      onValueChange={s => {
                        let floatMinPrice = parseFloat(s.toFixed(2));
                        setMinPriceFilter(floatMinPrice);
                      }}
                      onSlidingComplete={s => {
                        let floatMinPrice = parseFloat(s.toFixed(2));
                        setOffset(0);
                        setCurrentminPriceFilter(floatMinPrice);
                        setCurrentFilter(true);
                        _getShopResult(
                          0,
                          categryId_,
                          true,
                          floatMinPrice,
                          selectedAttributes,
                          undefined,
                          loyaltyProgramId,
                          productPricelistItemId,
                          discountRoute,
                        );
                      }}
                      thumbTintColor="#F23A3A"
                    />
                    <Text h4 bold>
                      {maxPrice}
                    </Text>
                  </View>

                  {data &&
                    Array.isArray(data) &&
                    data?.length > 0 &&
                    data?.map((attribute: any, index: number) => (
                      <View key={index}>
                        <TouchableOpacity
                          style={styles.accordionContainer}
                          onPress={() => handleAccordionPress(attribute.id)}
                        >
                          <View style={styles.attrName}>
                            <Text h4 bold>
                              {attribute.name}
                            </Text>
                            {openAccordion !== attribute.id &&
                              getSelectedCount(attribute.id) > 1 && (
                                <Text h4 style={{ color: 'gray' }}>
                                  ({getSelectedCount(attribute.id)})
                                </Text>
                              )}
                          </View>
                          <Image
                            source={
                              openAccordion === attribute.id
                                ? require('../../assets/icons/up.png')
                                : require('../../assets/icons/down.png')
                            }
                            style={styles.accordionArrow}
                          />
                        </TouchableOpacity>
                        {openAccordion === attribute.id && (
                          <Loader
                            isLoading={
                              attrDataLoader && openAccordion === attribute.id
                            }
                          >
                            <View style={styles.attrDataContainer}>
                              {attributeData[attribute.id] &&
                                attributeData[attribute.id]
                                  .slice(
                                    0,
                                    attribute?.type === 'color' && !seeAll
                                      ? 45
                                      : undefined,
                                  )
                                  .map((item, idx) => {
                                    const selectedValues =
                                      selectedAttributes[attribute.id] || [];
                                    let isSelected = selectedValues.includes(
                                      item.id,
                                    );
                                    let content;
                                    switch (attribute.display_type) {
                                      case 'color':
                                        content = (
                                          <TouchableOpacity
                                            key={idx}
                                            onPress={() => {
                                              handleSelectedAttributes(
                                                attribute.id,
                                                item.id,
                                              );
                                            }}
                                          >
                                            <View
                                              style={{
                                                width: isSelected
                                                  ? 34 * BW()
                                                  : null,
                                                height: isSelected
                                                  ? 34 * BW()
                                                  : null,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: isSelected ? 2 : 0,
                                                borderColor: isSelected
                                                  ? '#000'
                                                  : 'transparent',
                                                borderRadius: isSelected
                                                  ? 17 * BW()
                                                  : null,
                                                margin: isSelected
                                                  ? 2 * BW()
                                                  : null,
                                              }}
                                            >
                                              <View
                                                style={[
                                                  styles.colorCircle,
                                                  {
                                                    backgroundColor:
                                                      item.html_color,
                                                  },
                                                ]}
                                              />
                                            </View>
                                          </TouchableOpacity>
                                        );
                                        break;
                                      default:
                                        content = (
                                          <TouchableOpacity
                                            key={idx}
                                            onPress={() => {
                                              handleSelectedAttributes(
                                                attribute.id,
                                                item.id,
                                              );
                                            }}
                                          >
                                            <View
                                              style={{
                                                margin: 4 * BW(),
                                                paddingVertical: 2 * BW(),
                                                paddingHorizontal: 6 * BW(),
                                                borderColor: colors.gray + 'cc',
                                                borderWidth: 0.4 * BW(),
                                                backgroundColor: isSelected
                                                  ? '#303030'
                                                  : null,
                                              }}
                                            >
                                              <Text
                                                h5
                                                style={{
                                                  color: isSelected
                                                    ? '#fff'
                                                    : null,
                                                }}
                                              >
                                                {item.name}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        );
                                        break;
                                    }
                                    return content;
                                  })}
                            </View>

                            {attribute.display_type === 'color' &&
                              attributeData[attribute.id]?.length > 45 && (
                                <TouchableOpacity
                                  onPress={() => setSeeAll(!seeAll)}
                                >
                                  <Text
                                    style={{
                                      color: colors.primary,
                                      margin: 4 * BW(),
                                    }}
                                    h5
                                  >
                                    {seeAll ? 'See Less' : 'See All'}
                                  </Text>
                                </TouchableOpacity>
                              )}
                          </Loader>
                        )}
                      </View>
                    ))}
                </ScrollView>
                <View style={styles.filterBtns}>
                  <Button
                    title={t('activation')}
                    onPress={() => setOpenModal(false)}
                    style={styles.activationBtn}
                    styleText={{ color: '#fff' }}
                  />
                  <Button
                    title={t('reset')}
                    onPress={resetFilters}
                    style={styles.resetBtn}
                  />
                </View>
              </Loader>
            ) : (
              <View
                style={{
                  paddingVertical: 14 * BW(),
                  paddingHorizontal: 8 * BW(),
                  gap: 8 * BW(),
                }}
              >
                {options.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => {
                      setSortOption(option.key);
                      setSelectedSortOption(option.key);
                    }}
                    style={[
                      styles.sortButton,
                      selectedSortOption === option.key &&
                        styles.selectedSortButton,
                    ]}
                  >
                    <Text
                      h4
                      style={
                        selectedSortOption === option.key
                          ? styles.selectedSortButtonText
                          : colors.primaryColor
                      }
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
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

  const onRefresh = () => {
    setSelectedAttributes({});
    setOffset(0);
    setMinPriceFilter(minPrice);
    _getShopResult(0, categryId_);
  };

  // Return Child Category Result
  const getChildCategsFilter = (catId: number) => {
    setSelectedAttributes({});
    setOffset(0);
    setMinPriceFilter(minPrice);
    setcategryId_(catId);
    _getShopResult(
      0,
      catId,
      true,
      minPrice,
      {},
      undefined,
      loyaltyProgramId,
      productPricelistItemId,
      discountRoute,
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray + '22' }}>
      <Header
        hideDrawer
        hideNotification
        title={searchString}
        titleCenter
        hideTitle
        onPress={props?.route?.params?.backHandler}
        // showSerach
      />
      <View
        style={{
          paddingHorizontal: spacing.l / 2,
          paddingVertical: spacing.l / 4,
          flex:
            loading ||
            !(
              searchResult &&
              Array.isArray(searchResult) &&
              searchResult?.length > 0
            )
              ? 1
              : null,
        }}
      >
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {childCategs?.map((item, index) => (
              <TouchableOpacity
                key={item?.id?.toString() || index.toString()}
                style={styles.childCategsBtn}
                onPress={() => getChildCategsFilter(item?.id)}
              >
                <Text h3>{item?.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 * BW() }}
        >
          <TouchableOpacity
            style={styles.icon}
            onPress={() => openModalWithType('filter')}
          >
            <Image
              style={styles.styleIcon}
              source={require('../../assets/icons/filter.png')}
            />
            <Text h3 style={{ color: '#000' }}>
              {t('filters')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.icon}
            onPress={() => openModalWithType('sort')}
          >
            <Image
              style={styles.styleIcon}
              source={require('../../assets/icons/order.png')}
            />
            <Text h3 style={{ color: '#000' }}>
              {t('Sort')}
            </Text>
          </TouchableOpacity>
          {renderModal()}
        </View>
        {loading ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 200 * BW(),
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const even = index % 2 === 0;
              return (
                <Skeleton
                  key={`skeleton-${index}`}
                  containerStyle={{
                    flexDirection: 'column',
                    borderRadius: 8 * BW(),
                    // width: 160 * BW(),
                    // marginRight: 6 * BW(),
                    backgroundColor: colors.background,
                    borderWidth: 0.3 * BW(),
                    borderColor: colors.border,
                    marginLeft: !even ? spacing.l / 4 : 0,
                    marginRight: even ? spacing.l / 4 : 0,
                    width: 170 * BW(),
                    marginTop: even ? spacing.l / 1.8 : 8,
                  }}
                  isLoading={true}
                  layout={[
                    {
                      key: 'productContainer',
                      width: '100%',
                      height: 190 * BH(),
                    },
                    {
                      key: 'prodInfo',
                      padding: 6 * BW(),
                      paddingHorizontal: 8 * BW(),
                      children: [
                        {
                          key: 'productName',
                          width: 100 * BW(),
                          height: 8 * BW(),
                          marginBottom: 2 * BW(),
                        },
                        {
                          key: 'rowContainer',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          children: [
                            {
                              key: 'catName',
                              width: 60 * BW(),
                              height: 10 * BW(),
                            },
                            {
                              key: 'cart',
                              width: 35 * BW(),
                              height: 35 * BH(),
                            },
                          ],
                        },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        ) : searchResult &&
          Array.isArray(searchResult) &&
          searchResult?.length > 0 ? (
          <View style={{ marginBottom: 170 * BW() }}>
            <FlatListComp
              data={searchResult}
              renderItem={renderItem}
              onEndReached={fetchMoreData}
              ListFooterComponent={renderFooter}
              listkey={'-'}
              numColumns={2}
              contentContainerStyle={styles.container}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
              }}
              onRefresh={() => {
                onRefresh();
              }}
            />
          </View>
        ) : (
          <View style={styles.noData}>
            <Button
              style={{ backgroundColor: 'transparent' }}
              styleIcon={styles.noDataIcon}
              icon={require('../../../src/assets/header/search.png')}
            />
            <Text h2 style={{ textAlign: 'center', color: colors.gray }}>
              {t('NoMatchSearch')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
export default Shop;
const getStyle = (colors: any) =>
  StyleSheet.create({
    icon: {
      width: 80 * BW(),
      height: 36 * BH(),
      marginVertical: 8 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      gap: 4 * BW(),
      borderWidth: 1 * BW(),
      borderColor: colors.gray,
      borderRadius: 30 * BW(),
    },
    styleIcon: {
      width: 20 * BW(),
      height: 20 * BW(),
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      backgroundColor: colors.overlay,
    },
    modalContentContainer: {
      backgroundColor: '#fff',
      width: '88%',
      height: '96%',
      borderTopLeftRadius: 10 * BW(),
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 80 * BW(),
    },
    closeModal: {
      width: 28 * BW(),
      height: 28 * BW(),
      borderRadius: 14 * BW(),
      margin: 8 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    priceRangeContainer: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 8 * BW(),
    },
    accordionContainer: {
      paddingVertical: 14 * BW(),
      paddingHorizontal: 8 * BW(),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    attrName: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8 * BW(),
    },
    accordionArrow: {
      width: 12 * BW(),
      height: 12 * BW(),
      tintColor: colors.gray + 'cc',
    },
    attrDataContainer: {
      padding: 8 * BW(),
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    colorCircle: {
      width: 26 * BW(),
      height: 26 * BW(),
      margin: 4 * BW(),
      borderRadius: 13 * BW(),
    },
    filterBtns: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 6 * BW(),
      gap: 14 * BW(),
      marginHorizontal: 8 * BW(),
      marginBottom: 12 * BW(),
    },
    btn: {
      minWidth: 76 * BW(),
      paddingHorizontal: 8 * BW(),
      paddingVertical: 6 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    noData: {
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingHorizontal: 20,
    },
    noDataIcon: {
      width: 40 * BW(),
      height: 40 * BW(),
      tintColor: colors.gray,
    },
    // modalContainer: {
    //   flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   backgroundColor: 'rgba(0,0,0,0.5)',
    // },
    sortModalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    // modalContentContainer: {
    //   backgroundColor: '#fff',
    //   padding: 20,
    //   borderRadius: 10,
    // },
    sortModalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 10 * BW(),
      borderTopRightRadius: 10 * BW(),
    },
    sortButton: {
      padding: 4 * BW(),
      borderRadius: 5 * BW(),
      backgroundColor: '#fff',
    },
    selectedSortButton: {
      backgroundColor: colors.primaryColor,
      // borderColor: '#007BFF',
    },
    selectedSortButtonText: {
      color: '#fff',
    },
    activationBtn: {
      minWidth: 76 * BW(),
      paddingHorizontal: 8 * BW(),
      paddingVertical: 6 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryColor,
      borderRadius: 5 * BW(),
      height: 'auto',
    },
    resetBtn: {
      minWidth: 76 * BW(),
      paddingHorizontal: 8 * BW(),
      paddingVertical: 6 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1 * BW(),
      borderColor: colors.gray + 'cc',
      borderRadius: 5 * BW(),
      height: 'auto',
    },
    childCategsBtn: {
      width: 'auto',
      height: 34 * BH(),
      marginTop: 4 * BW(),
      marginHorizontal: 2 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      gap: 4 * BW(),
      paddingHorizontal: 8 * BW(),
      borderWidth: 1 * BW(),
      borderColor: colors.gray,
      borderRadius: 30 * BW(),
    },
    container: {
      // gap: 3 * BW(),
      justifyContent: 'space-between',
    },
  });
