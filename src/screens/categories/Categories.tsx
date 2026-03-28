import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from '../../component/Header';
import { useTranslation } from 'react-i18next';
import Loader from '../../component/Loader';
import {
  // getCategories,
  getMainCategories,
} from '../../redux/reducers/products/thunk/categories';
import { getShop } from '../../redux/reducers/shop/thunk/shop';
import { isArabic } from '../../locales';
import FlatListComp from '../../component/FlatList';
import Text from '../../component/Text';
import { BH, BW } from '../../style/theme';
import CustomImage from '../../component/CustomImage';
import NavigationService from '../../naigation/NavigationService';
import { getBaseURL, URL } from '../../redux/network/api';
import Skeleton from 'react-native-reanimated-skeleton';
import LinearGradient from 'react-native-linear-gradient';

function CategoriesScreen(): JSX.Element {
  const { colors } = useTheme();
  const { isLandscape } = useAppSelector(state => state.dimensions);
  const styles = getStyle(colors, isLandscape);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    searchResult,
    childCategs,
    count,
    searchLoading,
    searchError,
    offset,
  } = useAppSelector(state => state.search);

  const {
    offsetMainData,
    mainCategories,
    mainDataLoader,
    moredataMainLoading,
    totalMainPages,
  } = useAppSelector(state => state.products.mainCategories);

  const [selectedId, setSelectedId] = useState(0);
  const [selectedCateg, setSelectedCateg] = useState('');
  const [selectedChildCateg, setSelectedChildCateg] = useState('');
  const [selectedChildCategId, setSelectedChildCategId] = useState(0);

  const _getCategories = (offset: number) => {
    const totalPages = Math.ceil(count / 20);
    if (
      (!!selectedId && offset == 1) ||
      (!!selectedId && offset <= totalPages)
    ) {
      dispatch(
        getShop({
          search: '',
          limit: 20,
          offset: offset,
          cat_id: selectedId,
          filter_: false,
          with_child: true,
          order: 'list_price asc',
        }),
      );
    }
  };
  useEffect(() => {
    _getCategories(1);
  }, [selectedId]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const imageFullPath = URL + item.img;

    return (
      <>
        {/* <Animatable.View
        duration={1000}
        delay={150}
        animation={'zoomIn'}
        key={index}> */}
        <Skeleton
          containerStyle={{
            flexDirection: 'column',
            alignItems: 'center',
            // width: 70 * BW(),
          }}
          isLoading={searchLoading}
          layout={[
            {
              key: 'catContainer',
              // width: 70 * BW(),
              // height: 70 * BH(),
              marginBottom: 6 * BW(),
            },
            {
              key: 'catName',
              width: 60 * BW(),
              height: 10 * BW(),
              marginBottom: 10 * BW(),
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              if (item?.child_ids && item.child_ids.length > 0) {
                setSelectedId(item?.id);
                setSelectedCateg(item?.name);
                setSelectedChildCateg(item?.parent_name);
                setSelectedChildCategId(item?.parent_id);
              } else {
                // NavigationService.navigate('WebViewScreen', {
                //   url: `${BaseURL}/shop/category/${item?.id.toString()}`,
                // })
                NavigationService.navigate('Shop', {
                  searchString: item?.name,
                  cat_id: item?.id ? item.id : null,
                });
              }
            }}
            // style={styles.categoriesContainer}
          >
            <LinearGradient
              colors={[
                '#19749e',
                '#19749e',
                '#3ba4b5',
                '#7be0d3',
                '#f4f5e1',
                '#fafaf1',
              ]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.categoriesContainer}
            >
              <View style={[styles.categoriesCircle]}>
                <CustomImage
                  url={imageFullPath}
                  style={[styles.categoriesImage]}
                />
              </View>
              <View
                style={{
                  maxWidth: 78 * BW(),
                  marginTop: 4 * BW(),
                  flexWrap: 'wrap',
                }}
              >
                <Text
                  h5
                  bold
                  numberOfLines={2}
                  style={{
                    width: 80 * BW(),
                    textAlign: 'center',
                    // marginTop: 4 * BW(),
                    color: '#6F6F6F',
                  }}
                >
                  {item?.name}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Skeleton>
        {/* <TouchableOpacity
          onPress={() => {
            if (item?.child_ids) {
              setSelectedId(item?.id);
              setSelectedCateg(item?.name);
              setSelectedChildCateg(item?.parent_name);
              setSelectedChildCategId(item?.parent_id);
            } else {
              // NavigationService.navigate('WebViewScreen', {
              //   url: `${BaseURL}/shop/category/${item?.id.toString()}`,
              // })
              NavigationService.navigate('Shop', {
                searchString: item?.name,
                cat_id: item?.id ? item.id : null,
              });
            }
          }}
          style={styles.categoriesContainer}>
          <View style={[styles.categoriesCircle]}>
            <CustomImage
              url={imageFullPath}
              resizeMode={'contain'}
              style={styles.categoriesImage}
            />
          </View>
          <Text
            h5
            bold
            numberOfLines={2}
            style={{
              maxWidth: 80 * BW(),
              textAlign: 'center',
              marginTop: 4 * BW(),
              color: '#6F6F6F',
            }}>
            {item?.name}
          </Text>
        </TouchableOpacity> */}
        {/* </Animatable.View> */}
      </>
    );
  };

  const handleEndReached = () => {
    _getCategories(offset);
  };
  const onRefresh = () => {
    _getCategories(1);
  };

  // Main Categ
  const [selectedIndex, setSelectedIndex] = useState(0);
  const renderMainItem = ({ item, index }: { item: any; index: number }) => {
    const imageFullPath = `${URL}${item.img}`;
    // console.log('Image Path:', item.img);
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (item?.child_ids) {
              setSelectedId(item?.id), setSelectedIndex(index);
              setSelectedCateg(item?.name);
              setSelectedChildCateg('');
              setSelectedChildCategId(0);
            } else {
              NavigationService.navigate('Shop', {
                searchString: item?.name,
                cat_id: item?.id ? item.id : null,
              });
            }
          }}
          activeOpacity={0.9}
          // style={styles.container}
        >
          <View
            style={{
              // backgroundColor: selectedIndex == index ? '#F6E5BEAA' : '#fff',
              borderRadius: 100 * BW(),
              paddingHorizontal: 6 * BW(),
              paddingVertical: 8 * BW(),
              justifyContent: 'center',
              alignItems: 'center',
              width: 100 * BW(),
            }}
          >
            {/* {item?.categ_icon && <CustomImage
            url={URL + item?.categ_icon}
            resizeMode={'contain'}
           style={{width: 18 * BW(), height: 18 * BW(),  tintColor:selectedIndex == index ? '#CE9C56' : '#656D75'}}
           />} */}

            {selectedIndex == index ? (
              <View
                style={{
                  padding: 2 * BW(),
                  // marginHorizontal: 4,
                  // borderRadius: 100 * BW(),
                  // height: 80 * BH(),
                  // width: 80 * BH(),
                  alignItems: 'center',
                  // backgroundColor:  '#F6E5BEAA',
                  // paddingHorizontal:30
                  // marginVertical:30
                }}
              >
                <CustomImage
                  url={imageFullPath}
                  style={[
                    styles.maincategoriesImage,
                    { backgroundColor: '#F6E5BEAA', borderRadius: 100 * BW() },
                  ]}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.maincategoriesCircle,
                  { backgroundColor: '#e8e8e8aa' },
                ]}
              >
                <CustomImage
                  url={imageFullPath}
                  style={styles.maincategoriesImage}
                />
              </View>
            )}
            {/* <View style={[styles.categoriesCircle, {backgroundColor: selectedIndex == index ? '#F6E5BEAA' : '#f3f3f3ff',}]}>
              <CustomImage
                url={imageFullPath}
                // resizeMode={'contain'}
                style={styles.categoriesImage}
              />
            </View> */}
            <Text
              style={{
                color: selectedIndex == index ? '#CE9C56' : '#656D75',
                fontWeight: 'normal',
                lineHeight: 16 * BW(),
                maxWidth: 180 * BW(),
                textAlign: 'center',
                marginTop: 8 * BW(),
                // flexWrap:"wrap"
              }}
              // numberOfLines={2}
              h4
            >
              {item?.name}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  const _getMainCategories = (offsetMainData: number) => {
    if (offsetMainData <= totalMainPages) {
      dispatch(
        getMainCategories({
          call_number: offsetMainData,
          lang: isArabic() ? 'ar_001' : 'en_US',
        }),
      );
    }
  };
  const handleEndReachedMain = () => {
    _getMainCategories(offsetMainData);
  };

  useEffect(() => {
    _getMainCategories(offsetMainData);
  }, []);
  useEffect(() => {
    if (mainCategories.length > 0 && !!!selectedId) {
      setSelectedId(mainCategories[0].id);
      setSelectedCateg(mainCategories[0].name);
    }
  }, [mainCategories]);

  return (
    <View style={styles.appContainer}>
      <Header
        title={t('Category')}
        hideBack
        showCart
        showFav
        searchContainer
        hideDrawer
        hideNotification
      />
      <View style={{ flex: 1 }}>
        <Loader isLoading={mainDataLoader}>
          <View
            style={{
              // height: 60 * BW(),
              width: '100%',
              padding: 16 * BW(),
              // borderRightColor: '#453f3f',
              // borderRightWidth: 0.4 * BW(),
            }}
          >
            <FlatListComp
              data={mainCategories}
              renderItem={renderMainItem}
              showsVerticalScrollIndicator={false}
              onEndReached={handleEndReachedMain}
              moreLoading={moredataMainLoading}
              contentContainerStyle={{ alignSelf: 'flex-start' }}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          </View>
          <View style={styles.container}>
            <View style={{ marginBottom: 10 * BW(), flexDirection: 'row' }}>
              {selectedChildCateg ? (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 4 * BW(),
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedId(selectedChildCategId);
                      setSelectedChildCategId(0);
                      setSelectedCateg(selectedChildCateg);
                      setSelectedChildCateg('');
                    }}
                  >
                    <Text
                      h4
                      bold
                      style={{
                        lineHeight: 16 * BW(),
                        textAlign: 'center',
                        marginTop: 8 * BW(),
                      }}
                    >
                      {selectedChildCateg}
                    </Text>
                  </TouchableOpacity>
                  <Text h4 bold style={{ marginRight: 4 * BW() }}>
                    /
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4 * BW(),
                  alignItems: 'center',
                }}
              >
                <Text h4 bold>
                  {selectedCateg}
                </Text>
              </View>
            </View>
            {/* <Loader isLoading={dataLoader}> */}
            <FlatListComp
              data={childCategs}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                gap: 7 * BW(),
              }}
              onEndReached={handleEndReached}
              onRefresh={onRefresh}
              moreLoading={searchLoading}
              listkey={'-'}
              numColumns={4}
            />
            {/* </Loader> */}
          </View>
        </Loader>
      </View>
    </View>
  );
}

const getStyle = (colors: any, isLandscape: boolean) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 16 * BW(),
    },
    categoriesContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 7 * BW(),
      width: 80 * BW(),
      height: 116 * BW(),
      borderRadius: 10 * BW(),
      justifyContent: 'space-around',
      // borderColor: '#EBEBEB',
      // borderWidth: 1,
      // marginHorizontal:100
      // backgroundColor:"red"
    },
    categoriesCircle: {
      padding: 4 * BW(),
      marginHorizontal: 4,
      borderRadius: 100 * BW(),
      height: '70%',
      width: 80 * BH(),
      // backgroundColor: '#F5F5F5',
      // borderColor: '#EBEBEB',
      // borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoriesImage: {
      width: 80 * BW(),
      height: '100%',
      maxHeight: 70 * BW(),
      maxWidth: 70 * BW(),
      resizeMode: 'contain',
    },
    maincategoriesCircle: {
      padding: 4 * BW(),
      marginHorizontal: 4,
      borderRadius: 100 * BW(),
      height: 70 * BW(),
      width: 70 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    maincategoriesImage: {
      width: 90 * BW(),
      height: 90 * BW(),
      maxHeight: 80 * BW(),
      maxWidth: 80 * BW(),
      resizeMode: 'contain',
    },
  });

export default CategoriesScreen;
