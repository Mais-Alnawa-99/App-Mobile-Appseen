import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../../component/Text';
import {BW} from '../../../style/theme';
import Button from '../../../component/Button';
import {isArabic} from '../../../locales';
import NavigationService from '../../../naigation/NavigationService';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';

function FeaturedCategoriesStatic(props: any): JSX.Element {
  const data = [
    {
      img: require('../../../assets/homeBg/fCat0.png'),
      title: isArabic() ? 'الملابس والأحذية' : 'Fashion and Shoes',
      url: isArabic()
        ? 'https://seen.ae/ar/shop/category/50'
        : 'https://seen.ae/shop/category/50',
      id: 50,
      subCategories: [
        {
          title: isArabic() ? 'نساء' : 'Women',
          img: require('../../../assets/homeBg/women.png'),
          url: isArabic()
            ? 'https://seen.ae/ar/shop/category/52'
            : 'https://seen.ae/shop/category/52',
        },
        {
          title: isArabic() ? 'أطفال' : 'Kids',
          img: require('../../../assets/homeBg/kids.jpeg'),
          url: isArabic()
            ? 'https://seen.ae/ar/shop/category/53'
            : 'https://seen.ae/shop/category/53',
        },
      ],
      priority: 0,
    },
    {
      img: require('../../../assets/homeBg/fCat1.png'),
      title: 'Health and Beauty',
      url: isArabic()
        ? 'https://seen.ae/ar/shop/category/32'
        : 'https://seen.ae/shop/category/32',
      priority: 1,
    },
    {
      img: require('../../../assets/homeBg/fCat2.png'),
      title: 'Handicrafts and Gifts',
      url: isArabic()
        ? 'https://seen.ae/ar/shop/category/handicrafts-and-gifts-45'
        : 'https://seen.ae/shop/category/handicrafts-and-gifts-45',
      priority: 2,
    },
    {
      img: require('../../../assets/homeBg/fCat3.png'),
      title: 'Perfumes and Accessories',
      url: isArabic()
        ? 'https://seen.ae/ar/shop/category/perfumes-and-accessories-34'
        : 'https://seen.ae/shop/category/perfumes-and-accessories-34',
      priority: 2,
    },
  ];

  const {colors} = useTheme();
  const styles = getStyle(colors);

  const renderItem = ({item1, index}: {item1: any; index: any}) => (
    <TouchableOpacity
      key={index}
      style={{
        width: 130 * BW(),
        height: '100%',
        marginLeft: index == 0 ? 40 * BW() : 10 * BW(),
        borderRadius: 10 * BW(),
        overflow: 'hidden',
        backgroundColor: 'red',
      }}
      onPress={() =>
        NavigationService.navigate('WebViewScreen', {
          url: `${item1?.url}`,
        })
      }>
      <Text h3 style={{width: 80 * BW(), zIndex: 1, margin: 10 * BW()}}>
        {item1?.title}
      </Text>
      <Image
        source={item1?.img}
        resizeMode={'contain'}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          position: 'absolute',
          transform: [{rotateY: isArabic() ? '180deg' : '0deg'}],
        }}
      />
    </TouchableOpacity>
  );

  const renderItemPriority0 = ({item, index}: {item: any; index: number}) => (
    <View style={styles.mainCategory} key={index}>
      <Image
        source={item?.img}
        resizeMode={'contain'}
        style={styles.mainImage}
      />
      <View style={styles.categoryContent}>
        <View>
          <Text
            h1
            bold
            style={{color: '#fff', width: 100 * BW(), lineHeight: 25 * BW()}}>
            {item?.title}
          </Text>
          <Text h4 style={{color: '#fff', width: 90 * BW()}}>
            Select your favourite
          </Text>
          <Button
            style={styles.btn}
            title={'SHOP NOW'}
            containerIcon={{
              width: 14 * BW(),
              height: 12 * BW(),
              marginLeft: 4 * BW(),
              transform: [{rotate: isArabic() ? '180deg' : '0deg'}],
            }}
            h5
            styleIcon={{tintColor: '#000'}}
            icon={require('../../../assets/icons/Arrow-Icon.png')}
            onPress={() =>
              NavigationService.navigate('WebViewScreen', {
                url: `${item?.url}`,
              })
            }
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!!item?.subCategories &&
            item?.subCategories.map((item1, index) =>
              renderItem({item1, index}),
            )}
        </ScrollView>
      </View>
    </View>
  );

  const renderItemPriority1 = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      key={index}
      style={styles.mainCategory1}
      onPress={() =>
        NavigationService.navigate('WebViewScreen', {
          url: `${item?.url}`,
        })
      }>
      <Image
        source={item?.img}
        resizeMode={'contain'}
        style={styles.mainImage}
      />
    </TouchableOpacity>
  );

  const renderItemPriority2 = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      key={index}
      style={styles.mainCategory2}
      onPress={() =>
        NavigationService.navigate('WebViewScreen', {
          url: `${item?.url}`,
        })
      }>
      <Image
        source={item?.img}
        resizeMode={'contain'}
        style={styles.mainImage}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{marginBottom: 8 * BW(), gap: 6 * BW()}}>
      <FlatListComp
        data={data.filter(p => p.priority == 0)}
        renderItem={renderItemPriority0}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <FlatListComp
        data={data.filter(p => p.priority == 1)}
        renderItem={renderItemPriority1}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <FlatListComp
        data={data.filter(p => p.priority == 2)}
        renderItem={renderItemPriority2}
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
      marginRight: 10,
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

export default FeaturedCategoriesStatic;
