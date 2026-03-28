import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setSkipedIntro } from '../../redux/reducers/User/intro';
import { isArabic } from '../../locales';
import { BH, BW } from '../../style/theme';
import { store, reduxStorage } from '../../redux/store';
import Pagination from '../../component/CarouselPagination';
import Text from '../../component/Text';
import { useTranslation } from 'react-i18next';
import { getIntro } from '../../redux/reducers/intro/thunk/intro';
import CustomImage from '../../component/CustomImage';
import { getBaseURL } from '../../redux/network/api';
import Loader from '../../component/Loader';

const { width, height } = Dimensions.get('screen');

const slidersEn = [
  {
    img: require('../../assets/homeBg/10.jpg'),
  },
  {
    img: require('../../assets/homeBg/9.jpg'),
  },
  {
    img: require('../../assets/homeBg/HomeScreen.jpg'),
  },
  {
    img: require('../../assets/homeBg/intro4.png'),
  },
  {
    img: require('../../assets/homeBg/intro5.png'),
  },
  {
    img: require('../../assets/homeBg/intro6.png'),
  },
];

const slidersAr = [
  {
    img: require('../../assets/homeBg/intro1_ar.png'),
  },
  {
    img: require('../../assets/homeBg/intro2_ar.png'),
  },
  {
    img: require('../../assets/homeBg/intro3_ar.png'),
  },
  {
    img: require('../../assets/homeBg/intro4_ar.png'),
  },
  {
    img: require('../../assets/homeBg/intro5_ar.png'),
  },
  {
    img: require('../../assets/homeBg/intro6_ar.png'),
  },
];

function IntroPage(): JSX.Element {
  const { colors } = useTheme();
  const { isLandscape } = useAppSelector(state => state.dimensions);
  const styles = getStyle();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliders = isArabic() ? slidersAr : slidersEn;
  const { introData, introLoading, introError } = useAppSelector(
    state => state.introSlice,
  );
  const scrollViewRef = useRef(null);
  useEffect(() => {
    dispatch(getIntro());
  }, []);
  const handleNext = () => {
    if (currentIndex < introData?.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const scrollToX = isArabic()
        ? (introData?.length - 1 - nextIndex) * width
        : nextIndex * width;
      scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      setCurrentIndex(previousIndex);
      const scrollToX = isArabic()
        ? (introData?.length - 1 - previousIndex) * width
        : previousIndex * width;
      scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={introLoading}>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          horizontal
          scrollEventThrottle={16}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            const pageIndex = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );
            const newIndex = isArabic()
              ? introData?.length - 1 - pageIndex
              : pageIndex;
            setCurrentIndex(newIndex);
          }}
        >
          {introData &&
            Array.isArray(introData) &&
            introData?.length > 0 &&
            introData?.map((slide, index) => {
              return (
                <View key={index} style={{ width, height }}>
                  <CustomImage
                    url={getBaseURL() + slide?.image}
                    resizeMode={'cover'}
                    style={styles.imageStyle}
                  />
                </View>
              );
            })}
        </ScrollView>
        <View style={styles.container}>
          <View
            style={[
              styles.btnsContainer,
              { left: currentIndex > 0 ? 10 * BW() : 110 * BW() },
            ]}
          >
            {currentIndex > 0 && (
              <TouchableOpacity onPress={handlePrevious} style={styles.btn}>
                <Image
                  source={require('../../assets/icons/back.png')}
                  style={[
                    styles.previousButtonImage,
                    isArabic() && { transform: [{ scaleX: -1 }] },
                  ]}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={
                currentIndex < introData?.length - 1
                  ? handleNext
                  : () => dispatch(setSkipedIntro())
              }
              style={[styles.btn]}
            >
              <Image
                source={require('../../assets/icons/next.png')}
                style={[
                  styles.nextButtonImage,
                  isArabic() && { transform: [{ scaleX: -1 }] },
                ]}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.skipBtin}
            onPress={() => dispatch(setSkipedIntro())}
          >
            <Text h4>{t('skip')}</Text>
            <Image
              source={require('../../assets/icons/leftArrow.png')}
              style={[
                styles.nextButtonImage,
                styles.skipButtonImage,
                !isArabic() && { transform: [{ scaleX: -1 }] },
              ]}
            />
          </TouchableOpacity>
        </View>
      </Loader>
    </View>
  );
}

const getStyle = () =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    container: {
      position: 'absolute',
      overflow: 'hidden',
      bottom: 30 * BW(),
      flexDirection: 'row',
      width: '95%',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    btnsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 40 * BW(),
    },
    btn: {
      width: 60 * BW(),
      height: 60 * BW(),
      borderRadius: 60 * BW(),
      // overflow: 'hidden',
      // bottom: 30 * BW(),
      // position: 'absolute',
      backgroundColor: '#ffffff33',
      // left: 100 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipBtin: {
      width: 85 * BW(),
      height: 35 * BW(),
      borderRadius: 60 * BW(),
      backgroundColor: '#ffffff66',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 2 * BW(),
    },
    blurView: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageStyle: {
      width: '100%',
      height: '100%',
    },
    nextButtonImage: {
      width: 30 * BW(),
      height: 28 * BW(),
      tintColor: '#000',
      resizeMode: 'contain',
    },
    skipButtonImage: {
      width: 26 * BW(),
      height: 26 * BW(),
    },
    previousButtonImage: {
      width: 30 * BW(),
      height: 28 * BW(),
      tintColor: '#000',
      resizeMode: 'contain',
    },
    doneBtn: {
      width: 60 * BW(),
      height: 60 * BW(),
      borderRadius: 60 * BW(),
      overflow: 'hidden',
      bottom: 30 * BW(),
      position: 'absolute',
      backgroundColor: '#ffffff33',
      right: 60 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default IntroPage;
