import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import {BW} from '../../../style/theme';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import NavigationService from '../../../naigation/NavigationService';
import Text from '../../../component/Text';
import {useTranslation} from 'react-i18next';
import AnimatedCounter from '../../../component/AnimatedCounter';
function AllDiscounts(props: any): JSX.Element {
  const data = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const renderItem = ({item, index}: {item: Data; index: number}) => {
    const number = item.replace('%', '').trim();
    return (
      <TouchableOpacity
        key={index}
        style={{
          width: 90 * BW(),
          height: 90 * BW(),
          justifyContent: 'center',
          alignItems: 'flex-start',
          borderRadius: 8 * BW(),
          backgroundColor: '#C0433A',
          marginHorizontal: 4 * BW(),
          padding: 8 * BW(),
        }}
        onPress={() => {
          NavigationService.navigate('Shop', {
            discount: number,
          });
        }}>
        <Text h4 style={{color: '#fff'}}>
          {t('upTo')}
        </Text>
        <AnimatedCounter number={item} />
        {/* <Text h1 bold style={{color: '#fff'}}>
          {item}%
        </Text> */}
        <Text h4 style={{color: '#fff'}}>
          {t('shopNow')}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        paddingHorizontal: 14 * BW(),
      }}>
      <FlatListComp
        data={data?.data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    offerContainer: {
      height: 150 * BW(),
      width: Dimensions.get('screen').width - 60 * BW(),
      marginRight: 8 * BW(),
      borderRadius: 8 * BW(),
      overflow: 'hidden',
    },

    offerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });
export default AllDiscounts;
