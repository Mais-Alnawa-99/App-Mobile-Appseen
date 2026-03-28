import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, FlatList } from 'react-native';
import {
  ExpandingDot,
  ScalingDot,
} from 'react-native-animated-pagination-dots';
import theme, { BH, BW } from '../style/theme';
import { useTheme } from '@react-navigation/native';
import { I18nManager } from 'react-native';

export default function CarouselFlatList({
  data,
  showIcons,
  activeSlideProps,
  mode,
  style,
  renderItem,
  intervalDuration = 2000,
  containerStyle,
  autoPlay = true,
  ...props
}: any) {
  const width = Dimensions.get('window').width;
  const styles = getStyles();
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const invertedScrollX = I18nManager.isRTL
    ? scrollX.interpolate({
        inputRange: [0, width * (data.length - 1)],
        outputRange: [width * (data.length - 1), 0],
        extrapolate: 'clamp',
      })
    : scrollX;
  const { colors } = useTheme();
  useEffect(() => {
    if (data.length != 0 && autoPlay) {
      const interval = setInterval(() => {
        setActiveSlide(prevIndex => {
          const nextIndex = (prevIndex + 1) % data.length;
          flatListRef.current?.scrollToIndex({
            animated: true,
            index: nextIndex,
          });
          return nextIndex;
        });
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [data.length, intervalDuration]);

  useEffect(() => {
    if (data.length != 0 && autoPlay) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: activeSlide,
      });
    }
  }, [activeSlide]);
  return (
    <>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        pagingEnabled
        horizontal
        scrollEventThrottle={16}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        {...props}
      />
      {!!data && data.length > 1 && (
        <ScalingDot
          data={data}
          scrollX={invertedScrollX}
          activeDotScale={1.4 * BW()}
          inActiveDotOpacity={0.2 * BW()}
          dotStyle={{
            width: 8 * BW(),
            height: 8 * BW(),
            backgroundColor: colors.gray,
            borderRadius: 8 * BW(),
            marginHorizontal: 3 * BW(),
            borderWidth: 2 * BW(),
            borderColor: colors.gray + '22',
          }}
          activeDotColor={colors.gray}
          inActiveDotColor={colors.gray}
          containerStyle={{
            position: 'absolute',
            bottom: 5 * BW(),
            flexDirection: 'row',
            ...containerStyle,
          }}
        />
      )}
    </>
  );
}

const getStyles = () =>
  StyleSheet.create({
    button: {
      width: 110 * BW(),
      height: 120 * BH(),
      borderRadius: 8 * BW(),
      borderColor: theme.themeObject.colors.primaryColor,
      borderBottomWidth: 4 * BW(),
      justifyContent: 'space-around',
    },
    unactiveButton: {
      width: 110 * BW(),
      height: 120 * BH(),
      borderRadius: 8 * BW(),
      borderColor: '#C7C7C7',
      borderBottomWidth: 4 * BW(),
      justifyContent: 'space-around',
    },
    hideButton: {
      width: 110 * BW(),
      height: 120 * BH(),
      borderRadius: 8 * BW(),
      borderColor: '#C7C7C7',
      borderBottomWidth: 4 * BW(),
      justifyContent: 'space-around',
      opacity: 0,
    },
    icon: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: 4 * BW(),
      height: 60 * BH(),
      width: 20 * BW(),
      backgroundColor: '#EDEDED',
      marginRight: 10 * BW(),
    },
    iconLeft: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: 60 * BH(),
      borderRadius: 4 * BW(),
      width: 20 * BW(),
      backgroundColor: '#EDEDED',
      marginLeft: 10 * BW(),
    },
    hideIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: 60 * BH(),
      borderRadius: 4 * BW(),
      width: 20 * BW(),
      backgroundColor: '#EDEDED',
      opacity: 0,
      marginLeft: 10 * BW(),
    },
    carouselContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0 * BW(),
      borderBottomStartRadius: 15 * BW(),
      borderBottomEndRadius: 15 * BW(),
    },
  });
