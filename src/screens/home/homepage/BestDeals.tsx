import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {BaseURL} from '../../../redux/network/api';
import {BW} from '../../../style/theme';
import SectionTitle from './SectionTitle';
import NavigationService from '../../../naigation/NavigationService';
import Text from '../../../component/Text';
import {useTheme} from '@react-navigation/native';
import CustomImage from '../../../component/CustomImage';
import {isArabic} from '../../../locales';
const {width} = Dimensions.get('window');

const chunkArray = (arr, size) => {
  return arr.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    [],
  );
};

function BestDeals(props: any): JSX.Element {
  const data = props?.data;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const flatListRef = useRef<FlatList>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setSlides(chunkArray(data?.data, 3));
    } else {
      setSlides([]);
    }
  }, [data?.data]);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % slides.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activeIndex, slides.length]);

  const renderSlide = ({item}) => {
    return (
      <View style={styles.slide}>
        {item.map((product, idx) => {
          const imageUrl = product?.img_url_256?.startsWith('http')
            ? product?.img_url_256
            : `${BaseURL}${product?.img_url_256}`;
          const productPriceObj = product?.products_prices?.[product?.id];
          const discount = productPriceObj?.discount_percentage;
          return (
            <TouchableOpacity
              style={styles.card}
              key={idx}
              onPress={() =>
                NavigationService.navigate('ProductDetails', {item: product})
              }>
              <CustomImage
                url={imageUrl}
                style={styles.image}
                resizeMode="cover"
              />
              {discount && (
                <View style={styles.discountBadge}>
                  <Text h3 style={{color: '#fff'}}>
                    -{discount}%
                  </Text>
                </View>
              )}
              <Text h4 numberOfLines={1}>
                {product?.category_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 16 * BW(),
        paddingVertical: 20 * BW(),
        backgroundColor: colors.gray + '33',
      }}>
      {data?.display_title ? (
        <SectionTitle
          data={data}
          onPress={() =>
            NavigationService.navigate('AllProducts', {
              data: data?.data,
              title: data?.title,
            })
          }
        />
      ) : null}
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          // pagingEnabled
          inverted={isArabic() ? true : false}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: width - 42 * BW(),
            offset: (width - 42 * BW()) * index,
            index,
          })}
          onScrollToIndexFailed={info => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 500);
          }}
        />
      </View>
    </View>
  );
}
export default BestDeals;

const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      // paddingVertical: 10,
      borderColor: 'red',
      borderWidth: 1.5 * BW(),
      borderRadius: 10 * BW(),
      padding: 8 * BW(),
    },
    slide: {
      width: width - 42 * BW(),
      // marginRight: 8 * BW(),
      flexDirection: isArabic() ? 'row-reverse' : 'row',
      // justifyContent: 'center', 
      // gap: 8 * BW(),
    },
    card: {
      // width: width / 3 - 25,
      width: "31%",
      backgroundColor: 'white',
      borderRadius: 10 * BW(),
      padding: 6 * BW(),
      alignItems: 'center',
      // marginRight: 8 * BW()
      marginStart: isArabic() ? 0 : 0 * BW(), // أول عنصر في العربية بدون مسافة على اليسار
      marginEnd: isArabic() ? 8 * BW() : 8, // باقي العناصر يمين
    },
    image: {
      width: 90 * BW(),
      height: 110 * BW(),
      borderRadius: 10 * BW(),
    },
    discountBadge: {
      position: 'absolute',
      top: 6 * BW(),
      right: 6 * BW(),
      backgroundColor: 'red',
      paddingHorizontal: 8 * BW(),
      borderRadius: 4 * BW(),
    },
  });
