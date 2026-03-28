import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Carousel from 'react-native-reanimated-carousel';
import type {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import Button from './Button';
import {isArabic} from '../locales';
import theme, {BH, BW} from '../style/theme';
import {useSharedValue} from 'react-native-reanimated';

type Props = {
  data?: any[];
  activeSlideProps?: number;
  showIcons?: boolean;
  style?: {};
  mode?: any;
  renderItem: CarouselRenderItem<CarouselItem>;
};

export default function CustomCarousel({
  data,
  showIcons,
  activeSlideProps,
  mode,
  style,
  renderItem,
  ...props
}: Props) {
  const width = Dimensions.get('window').width;
  const styles = getStyles();
  const [activeSlide, setActiveSlide] = useState<number>(
    activeSlideProps ? activeSlideProps : 0,
  );

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  const [value, setValue] = useState(0);

  // Animated value for the slider
  const animatedValue = new Animated.Value(value);

  const handleValueChange = newValue => {
    setValue(newValue);
    Animated.timing(animatedValue, {
      toValue: newValue,
      duration: 300, // Adjust animation duration as needed
      useNativeDriver: false,
    }).start();
  };
  const renderPageIndicator = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {data.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === activeSlide ? 'black' : 'gray',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <View style={styles.carouselContainer}>
        {showIcons && (
          <Button
            style={
              data && data?.length - 1 == activeSlide
                ? styles.hideIcon
                : styles.icon
            }
            icon={require('../assets/icons/next.png')}
            activeOpacity={0.85}
            disabled={data && data?.length - 1 == activeSlide}
            onPress={() => {
              ref.current?.next();
            }}
            styleIcon={{
              tintColor: theme.themeObject.colors.primaryColor,

              width: 11 * BW(),
              height: 11 * BW(),
              resizeMode: 'contain',
              transform: [{rotate: !isArabic() ? '180deg' : '0deg'}],
            }}
          />
        )}
        <Carousel
          ref={ref}
          loop={false}
          height={125 * BH()}
          autoPlay={false}
          width={110 * BW()}
          style={{
            width: width - 90 * BW(),
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}
          mode={mode ? mode : 'parallax'}
          scrollAnimationDuration={800}
          data={data ? data : []}
          onSnapToItem={(index: number) => {
            (setActiveSlide(index), handleValueChange(index));
          }}
          renderItem={renderItem}
          defaultIndex={activeSlide}
          pagingEnabled={true}
          {...props}
        />

        {showIcons && (
          <Button
            style={activeSlide === 0 ? styles.hideIcon : styles.iconLeft}
            icon={require('../assets/icons/next.png')}
            activeOpacity={0.85}
            disabled={activeSlide === 0}
            onPress={() => {
              ref.current?.prev();
            }}
            styleIcon={{
              tintColor: theme.themeObject.colors.primaryColor,
              width: 15 * BW(),
              height: 15 * BW(),
              resizeMode: 'center',
              transform: [{rotate: !isArabic() ? '0deg' : '180deg'}],
            }}
          />
        )}
      </View>

      {/* {
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            marginVertical: 12 * BW(),
            gap: 4 * BW(),
          }}>
          {data.map((_, index) => (
            <TouchableOpacity onPress={() => ref?.current?.setIndex(1)}>
              {index == activeSlide && (
                <Animatable.View
                  key={index}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: 'blue',
                  }}
                  animation={'zoomIn'}
                />
              )}
              {index != activeSlide && (
                <Animatable.View
                  key={index}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2.5,
                    backgroundColor: 'lightgray',
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      } */}
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
