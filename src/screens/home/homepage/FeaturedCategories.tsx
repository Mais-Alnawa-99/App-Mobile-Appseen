import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {BW} from '../../../style/theme';
import {isArabic} from '../../../locales';
import NavigationService from '../../../naigation/NavigationService';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';
import {getBaseURL, URL} from '../../../redux/network/api';
import CustomImage from '../../../component/CustomImage';

function FeaturedCategories(props: any): JSX.Element {
  const {data} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const mainCategory = data?.main_category_data;
  const mainCategoryImage = isArabic()
    ? mainCategory?.background_ar
      ? mainCategory?.background_ar
      : mainCategory?.background
    : mainCategory?.background;
  const imageFullPath = URL + mainCategoryImage;

  const renderCategoriesData = ({item, index}: {item: any; index: number}) => {
    const categoriesImage = isArabic()
      ? item?.background_ar
        ? item?.background_ar
        : item?.background
      : item?.background;
    const categoriesImagePath = URL + categoriesImage;

    return (
      <TouchableOpacity
        key={index}
        style={styles.mainCategory2}
        onPress={() => {
          !!item?.url &&
            NavigationService.navigate('WebViewScreen', {
              url: `${getBaseURL()}${item?.url}`,
            });
        }}>
        <CustomImage
          url={categoriesImagePath}
          resizeMode={'cover'}
          style={styles.mainImage}
        />
        {/* <Image
                    source={require('../../../assets/homeBg/fCat2.png')}
                    resizeMode={'contain'}
                    style={styles.mainImage}
                /> */}
      </TouchableOpacity>
    );
  };
  return (
    <View style={{marginBottom: 8 * BW(), gap: 6 * BW()}}>
      <TouchableOpacity
        style={styles.mainCategory1}
        onPress={() => {
          !!mainCategory?.url &&
            NavigationService.navigate('WebViewScreen', {
              url: `${getBaseURL()}${mainCategory?.url}`,
            });
        }}>
        <CustomImage
          url={imageFullPath}
          resizeMode={'cover'}
          style={styles.mainImage}
        />
        {/* <Image
                    source={require('../../../assets/homeBg/fCat1.png')}
                    resizeMode={'contain'}
                    style={styles.mainImage}
                /> */}
      </TouchableOpacity>
      <FlatListComp
        data={data?.categories_data}
        renderItem={renderCategoriesData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{width: '100%', justifyContent: 'space-between'}}
      />
    </View>
  );
}
const getStyle = (colors: any) =>
  StyleSheet.create({
    mainCategory: {
      height: 200 * BW(),
      width: Dimensions.get('screen').width,
      borderRadius: 0 * BW(),
      overflow: 'hidden',
      position: 'relative',
    },
    mainCategory1: {
      height: 180 * BW(),
      width: Dimensions.get('screen').width,
    },
    mainCategory2: {
      height: 180 * BW(),
      width: Dimensions.get('screen').width / 2 - 0 * BW(),
      borderRadius: 0 * BW(),
      overflow: 'hidden',
      position: 'relative',
      marginRight: 10 * BW(),
    },
    mainImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: 'absolute',
    },
    categoryContent: {
      flexDirection: 'row',
      paddingLeft: 15 * BW(),
      paddingVertical: 15 * BW(),
      height: '100%',
    },
    subCategoryScroll: {
      width: 10 * BW(), // Ensure height is set to allow scrolling
    },
    btn: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      height: 'auto',
      padding: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
      marginTop: 30 * BW(),
      width: 90 * BW(),
    },
  });

export default FeaturedCategories;
