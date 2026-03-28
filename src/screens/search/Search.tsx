import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../component/Header';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useTheme } from '@react-navigation/native';
import { BW, BH } from '../../style/theme';
import { isArabic } from '../../locales';
import FlatListComp from '../../component/FlatList';
import { getSuggestions } from '../../redux/reducers/search/thunk/suggestions';
import RenderHtmlComponent from '../../component/renderHtml/RenderHtml';
import NavigationService from '../../naigation/NavigationService';
import { getBaseURL } from '../../redux/network/api';
import CustomImage from '../../component/CustomImage';
import { useTranslation } from 'react-i18next';
import Text from '../../component/Text';
import AddToCartBtn from '../home/homepage/AddToCart';
import appsFlyer from 'react-native-appsflyer';
const SearchScreen = (props: any): JSX.Element => {
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { suggestions } = useAppSelector(state => state?.suggestions);
  const [suggestionData, setSuggestionData] = useState(suggestions || []);
  const [searchValue, setSearchValue] = useState('');
  const { authenticatedUser } = useAppSelector(state => state.auth);
  let lang = isArabic() ? 'ar_001' : 'en_US';

  useEffect(() => {
    setSuggestionData(suggestions);
  }, [suggestions]);

  const _getSuggestionData = (searchString: string) => {
    dispatch(getSuggestions({ suggestion: searchString }));
  };

  useEffect(() => {
    const searchString = searchValue.trim();
    if (!!searchString) {
      _getSuggestionData(searchString);
    } else {
      _getSuggestionData('');
    }
  }, [searchValue]);

  useEffect(() => {
    setSearchValue('');
  }, []);

  const handleSearch = () => {
    const searchString = searchValue.trim();
    if (searchString) {
      setSearchValue(searchString);
    }
  };

  const handlePressSearchBtn = () => {
    appsFlyer.logEvent(
      'search',
      {
        search_string: searchValue,
        user_type: authenticatedUser ? 'logged_in' : 'guest',
        user_id: authenticatedUser || null,
      },
      result => console.log('Appsflyer search event logged:', result),
      error => console.error('Appsflyer search event error:', error),
    );
    NavigationService.navigate('Shop', {
      searchString: searchValue,
    });
  };

  const renderItem = ({ item, index }: { item: any; index: any }) => {
    const highlightedName = item?.name.replace(
      new RegExp(searchValue, 'gi'),
      match =>
        `<span style="background-color: #ffe200c2;border-radius: 5px; display: inline-block;">${match}</span>`,
    );
    const handlePress = () => {
      appsFlyer.logEvent(
        'search_suggestion_click',
        {
          search_string: item?.name || '',
          suggestion_type: item?.type,
          user_type: authenticatedUser ? 'logged_in' : 'guest',
          user_id: authenticatedUser || null,
        },
        result =>
          console.log('Appsflyer search suggestion event logged:', result),
        error =>
          console.error('Appsflyer search suggestion event error:', error),
      );
      if (!!item?.seller) {
        console.log('?? Seller clicked:', item);
        NavigationService.navigate('SellerProfile', {
          sellerId: item?.id,
        });
        // NavigationService.navigate('WebViewScreen', {
        //   url: `${getBaseURL()}/seller/profile/${item?.id.toString()}`,
        // });
      } else if (item?.type === 'product') {
        NavigationService.navigate('ProductDetails', { item: item });
      } else {
        NavigationService.navigate('Shop', {
          searchString: item?.name,
          cat_id: item?.id ? item.id : null,
        });
      }
    };
    let content = null;
    if (item?.type === 'product') {
      const imageFullPath = getBaseURL() + item?.img_url_512;
      content = (
        <TouchableOpacity
          key={index}
          onPress={handlePress}
          style={{
            flexDirection: 'row',
            marginVertical: 2 * BW(),
            borderBottomWidth: 1,
            borderBottomColor: `${colors.border}aa`,
          }}
        >
          <CustomImage
            url={imageFullPath}
            resizeMode={'cover'}
            style={{
              width: 80 * BW(),
              height: 110 * BH(),
            }}
          />
          <View style={{ justifyContent: 'space-between' }}>
            <RenderHtmlComponent
              description={highlightedName || item?.name}
              noAutoWidth={true}
            />
            <RenderHtmlComponent
              description={item?.description_sale}
              noAutoWidth={true}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 8 * BW(),
                  marginBottom: 8 * BW(),
                }}
              >
                <Text h4>{t('category')} : </Text>
                <Text h4>{item?.category_name}</Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: 60 * BW(),
                }}
              >
                {!item?.out_of_stock && (
                  <AddToCartBtn
                    prodId={item?.id}
                    home={true}
                    bestContainer={true}
                    // onPress={(e) => e.stopPropagation()}
                  />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (item?.type === 'category') {
      content = (
        <TouchableOpacity
          key={index}
          onPress={handlePress}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.border}aa`,
          }}
        >
          <RenderHtmlComponent
            description={highlightedName || item?.name}
            noAutoWidth={true}
          />
        </TouchableOpacity>
      );
    } else if (item?.type === 'seller') {
      const imageFullPath = getBaseURL() + item?.img_url_512;
      content = (
        <TouchableOpacity
          key={index}
          onPress={handlePress}
          style={{
            flexDirection: 'row',
            marginVertical: 2 * BW(),
            borderBottomWidth: 1,
            borderBottomColor: `${colors.border}aa`,
          }}
        >
          <CustomImage
            url={imageFullPath}
            resizeMode={'cover'}
            style={{
              width: 80 * BW(),
              height: 110 * BH(),
            }}
          />
          <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <RenderHtmlComponent
              description={highlightedName || item?.name}
              noAutoWidth={true}
            />
            <View
              style={{
                marginLeft: 8 * BW(),
                marginBottom: 8 * BW(),
              }}
            >
              <Text h4>{t('store')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return content;
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        searchCenter
        hideDrawer
        hideNotification
        hideTitle
        searchCenterStyle={{ width: 300 * BW() }}
        onSearch={handleSearch}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        onPressSearchBtn={handlePressSearchBtn}
      />
      {Array.isArray(suggestionData) && suggestionData?.length > 0 && (
        <FlatListComp
          data={suggestionData}
          renderItem={renderItem}
          listkey={'#'}
          contentContainerStyle={{}}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          style={{
            paddingHorizontal: 8 * BW(),
          }}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      paddingLeft: 16 * BW(),
      paddingBottom: 16 * BW(),
    },
    container: {
      flex: 1,
      padding: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    categoriesContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 16 * BW(),
      width: 72 * BW(),
    },
    categoriesCircle: {
      padding: 8 * BW(),
      marginHorizontal: 4,
      borderRadius: 10 * BW(),
      height: 75 * BH(),
      width: '100%',
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoriesImage: {
      width: 60 * BW(),
      height: 60 * BW(),
      maxHeight: 70 * BW(),
      maxWidth: 70 * BW(),
      resizeMode: 'contain',
    },
  });
