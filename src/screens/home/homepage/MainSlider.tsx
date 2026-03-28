import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {BH, BW} from '../../../style/theme';
import {useTheme} from '@react-navigation/native';
import CarouselFlatList from '../../../component/CarouselFlatList';
import CustomImage from '../../../component/CustomImage';
import {URL} from '../../../redux/network/api';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../../naigation/NavigationService';
interface mainSliderData {
  id: string;
  image: any;
}
function MainSlider({mainSliderData}: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const [activeIndex, setActiveIndex] = useState(0);

  // Get Dimensions
  const screenWidth = Dimensions.get('window').width;

  const renderItem = ({item, index}: {item: mainSliderData; index: number}) => {
    return (
      <TouchableOpacity
        style={{
          width: screenWidth,
          paddingHorizontal: 18 * BW(),
          height: 240 * BH(),
          marginTop: 8 * BW(),
        }}
        activeOpacity={1}
        onPress={() => {
          !!item?.url &&
            NavigationService.navigate('WebViewScreen', {
              url: `${URL}${item?.url}`,
            });
        }}>
        <CustomImage
          url={URL + item.background}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            // marginTop: Platform.OS ? 160 * BW() : 150 * BW(),
            borderRadius: 15 * BW(),
            overflow: 'hidden',
          }}
        />
        <LinearGradient
          colors={['transparent', '#ffffff22', '#ffffff66', '#ffffff99']}
          style={styles.gradient}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {!!mainSliderData && mainSliderData.length != 0 && (
        <>
          <CarouselFlatList
            data={mainSliderData}
            loop={true}
            autoPlay={true}
            width={screenWidth}
            renderItem={renderItem}
            mode="normal-horizontal"
            // style={{width: screenWidth}}
            intervalDuration={6000}
          />
        </>
      )}
    </View>
  );
}
const getStyle = (colors: any) =>
  StyleSheet.create({
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60 * BW(),
    },
  });
export default MainSlider;
