import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AppIntroSlider from 'react-native-app-intro-slider';
import Button from '../../component/Button';
import { BH, BW } from '../../style/theme';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { setSkipedIntro } from '../../redux/reducers/User/intro';
import { isArabic } from '../../locales';
import Text from '../../component/Text';
import { t } from 'i18next';
import { getIntro } from '../../redux/reducers/intro/thunk/intro';
import Loader from '../../component/Loader';
import CustomImage from '../../component/CustomImage';
import { getBaseURL } from '../../redux/network/api';

const slidersEn = [
  {
    img: require('../../assets/homeBg/intro1.png'),
  },
  {
    img: require('../../assets/homeBg/intro2.png'),
  },
  {
    img: require('../../assets/homeBg/intro3.png'),
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

function IntroPageIos(): JSX.Element {
  const { colors } = useTheme();
  const { isLandscape } = useAppSelector(state => state.dimensions);
  const styles = getStyle(colors, isLandscape);
  const dispatch = useAppDispatch();
  const sliders = isArabic() ? slidersAr : slidersEn;
  const AppIntroRef = useRef<AppIntroSlider>(null);
  const { introData, introLoading, introError } = useAppSelector(
    state => state.introSlice,
  );

  const [selectedSlide, setSelectedSlide] = useState(0);
  useEffect(() => {
    dispatch(getIntro());
  }, []);

  const _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <CustomImage
          url={getBaseURL() + item?.image}
          resizeMode={'cover'}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>
    );
  };

  const handleNext = () => {
    if (selectedSlide < introData?.length - 1) {
      let slide = selectedSlide;
      setSelectedSlide(selectedSlide + 1);
      AppIntroRef.current?.goToSlide(slide + 1);
    } else if (selectedSlide == introData?.length - 1) {
      dispatch(setSkipedIntro());
    }
  };
  const handlePrev = () => {
    if (selectedSlide > 0) {
      let slide = selectedSlide;
      setSelectedSlide(selectedSlide - 1);
      AppIntroRef.current?.goToSlide(slide - 1);
    }
  };

  return (
    <View style={styles.appContainer}>
      <Loader isLoading={introLoading}>
        <AppIntroSlider
          data={introData || []}
          ref={AppIntroRef}
          activeDotStyle={{ backgroundColor: '#CE9C56' }}
          renderItem={_renderItem}
          showPrevButton={false}
          showNextButton={false}
          showDoneButton={false}
          dotStyle={{ display: 'none' }}
          activeDotStyle={{ display: 'none' }}
          dotClickEnabled={false}
          onSlideChange={res => setSelectedSlide(res)}
          // renderSkipButton={_renderNextButton}
        />
        <View style={styles.container}>
          <View
            style={[
              styles.btnsContainer,
              { left: selectedSlide > 0 ? 10 * BW() : 110 * BW() },
            ]}
          >
            {selectedSlide > 0 && (
              <TouchableOpacity
                onPress={() => {
                  handlePrev();
                }}
                style={styles.btn}
              >
                <BlurView
                  blurType="light"
                  blurAmount={0}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                  }}
                />
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
              onPress={() => {
                handleNext();
              }}
              style={[styles.btn]}
            >
              <BlurView
                blurType="light"
                blurAmount={0}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
              />
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
            <BlurView
              blurType="light"
              blurAmount={4}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
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

const getStyle = (colors: any, isLandscape: boolean) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },

    icon: {
      width: 30 * BW(),
      height: 28 * BW(),
      tintColor: '#000',
      resizeMode: 'contain',
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
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    skipBtin: {
      width: 85 * BW(),
      height: 35 * BW(),
      borderRadius: 60 * BW(),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 2 * BW(),
      overflow: 'hidden',
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

export default IntroPageIos;
