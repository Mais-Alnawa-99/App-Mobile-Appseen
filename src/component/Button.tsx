import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useScrollToTop, useTheme} from '@react-navigation/native';
import theme, {BH, BW} from '../style/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import Text from './Text';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
export default function Button(props: any): JSX.Element {
  const {colors} = useTheme();

  const styles = getStyles(colors);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (props.badgeValue !== undefined) {
      scale.value = withSequence(
        withSpring(1.5, {stiffness: 200}),
        withSpring(1, {stiffness: 200}),
      );
    }
  }, [props.badgeValue]);

  const animatedBadgeStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props?.loading ? () => {} : props.onPress}
      onLongPress={props.onLongPress}
      activeOpacity={props.activeOpacity ? props.activeOpacity : 0.4}
      style={[
        styles.btn,
        {height: props?.header ? 40 * BH() : 80 * BH()},
        {...props.style},
        props.disabled && {
          backgroundColor: props.backgroundColorDisabled
            ? props.backgroundColorDisabled
            : colors?.primary + '88',
        },
        props.shadow && {...theme.shadow},
        {overflow: props.badgeValue ? 'visible' : 'hidden'},
      ]}>
      {props?.loading && (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            size="small"
            color={props.loadingColor ? props.loadingColor : '#fff'}
          />
        </View>
      )}
      {!props?.loading && !!props?.icon && !props?.sharedTransitionTag && (
        <View style={[styles.containerIcon, {...props.containerIcon}]}>
          <Image
            source={props?.icon}
            style={[styles.icon, {...props.styleIcon}]}
          />
        </View>
      )}
      {!props?.loading && !!props?.sharedTransitionTag && !!props?.icon && (
        <View style={[styles.containerIcon, {...props.containerIcon}]}>
          <Animated.Image
            source={props?.icon}
            sharedTransitionTag={props.sharedTransitionTag}
            style={[styles.icon, {...props.styleIcon}]}
          />
        </View>
      )}
      {!props?.loading && !!props?.title && (
        <Text
          h4={!props.h3 && !props.h2 && !props.h1 && !props.fontSize}
          h3={props.h3}
          h2={props.h2}
          h1={props.h1}
          h5={props.h5}
          h6={props.h6}
          bold={props.bold}
          style={props.styleText}
          numberOfLines={props?.numberOfLines}>
          {props?.title}
        </Text>
      )}
      {props?.type === 'chabter' && (
        <Icon name="angle-left" size={14} color="#C79D65" />
      )}
      {!!props?.antDesign && (
        <AntDesign
          name={props?.antDesign}
          size={props?.antDesignSize || 20 * BW()}
          color={props?.antDesignColor || '#C79D65'}
        />
      )}
      {!!props?.ionicons && (
        <Ionicons
          name={props?.ionicons}
          size={props?.ioniconsSize || 20 * BW()}
          color={props?.ioniconsColor || '#C79D65'}
        />
      )}
      {!!props?.octicons && (
        <Octicons
          name={props?.octicons}
          size={props?.octiconsSize || 20 * BW()}
          color={props?.octiconsColor || '#C79D65'}
        />
      )}
      {!!props?.fontAwesome5 && (
        <FontAwesome5
          name={props?.fontAwesome5}
          size={props?.fontAwesome5Size || 20 * BW()}
          color={props?.fontAwesome5Color || '#C79D65'}
        />
      )}
      {!!props?.badgeValue && (
        <Animated.View style={[styles.badge, animatedBadgeStyle]}>
          <Text h5 style={styles.badgeText}>
            {props.badgeValue}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    btn: {
      // height: 80 * BH(),
      borderRadius: 8 * BW(),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      padding: 10 * BW(),
    },
    icon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    containerIcon: {
      width: 30 * BW(),
      height: 30 * BH(),
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgCover: {
      width: '100%',
      height: '100%',
      tintColor: 'rgba(0,0,0,0.3)',
      resizeMode: 'contain',
    },
    logoContainer: {
      width: '100%',
      height: '80%',
      position: 'absolute',
      alignSelf: 'flex-start',
      justifyContent: 'flex-end',
      bottom: 5 * BW(),
      left: 5 * BW(),
    },
    badge: {
      position: 'absolute',
      top: -5 * BW(),
      right: -10 * BW(),
      backgroundColor: '#ff0000aa',
      borderRadius: 9 * BW(),
      width: 18 * BW(),
      height: 18 * BW(),
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: 'white',
    },
  });
