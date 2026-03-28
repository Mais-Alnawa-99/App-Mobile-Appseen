import React from 'react';
import {StyleSheet, Text, Platform} from 'react-native';

import theme, {BH, BW} from '../style/theme';
import {useTheme} from '@react-navigation/native';

type TypeProps = {
  style?: object;
  bold?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  justify?: boolean;
  numberOfLines?: any;
  onTextLayout?: any;
  children?: React.ReactNode;
  lineHeight?: boolean;
};
export default ({
  style,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  bold,
  children,
  numberOfLines,
  onTextLayout,
  justify,
  lineHeight,
  ...props
}: TypeProps): JSX.Element => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  let currentStyle = Object([
    styles.defaultTextStyle,
    {color: colors?.text, ...style},
  ]);
  if (bold) {
    Platform.OS === 'android'
      ? (currentStyle = [
          ...currentStyle,
          {fontFamily: theme.themeObject.currentFontFamily.bold},
        ])
      : (currentStyle = [...currentStyle, {fontWeight: 'bold'}]);
  }
  if (justify) {
    currentStyle = [
      ...currentStyle,
      {textAlign: 'justify', writingDirection: 'rtl'},
    ];
  }

  if (h1) {
    if (
      theme.themeObject.fontFamily == 'montserrat' &&
      theme.themeObject.fontSize == 'normal'
    ) {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.normalMontserratFontSize.h1},
      ];
    } else {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.themeObject.currentFontSize.h1},
      ];
    }
  }

  if (h2) {
    if (
      theme.themeObject.fontFamily == 'montserrat' &&
      theme.themeObject.fontSize == 'normal'
    ) {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.normalMontserratFontSize.h2},
      ];
    } else {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.themeObject.currentFontSize.h2},
      ];
    }
  }
  if (h3) {
    if (
      theme.themeObject.fontFamily == 'montserrat' &&
      theme.themeObject.fontSize == 'normal'
    ) {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.normalMontserratFontSize.h3},
      ];
    } else {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.themeObject.currentFontSize.h3},
      ];
    }
  }
  if (h4) {
    if (
      theme.themeObject.fontFamily == 'montserrat' &&
      theme.themeObject.fontSize == 'normal'
    ) {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.normalMontserratFontSize.h4},
      ];
    } else {
      currentStyle = [
        ...currentStyle,
        {fontSize: theme.themeObject.currentFontSize.h4},
      ];
    }
  }
  if (h5) {
    currentStyle = [
      ...currentStyle,
      {fontSize: theme.themeObject.currentFontSize.h5},
    ];
  }
  if (h6) {
    currentStyle = [
      ...currentStyle,
      {fontSize: theme.themeObject.currentFontSize.h6},
    ];
  }
  if (lineHeight) {
    currentStyle = [{lineHeight: 26 * BH()}, ...currentStyle];
  }

  return (
    <Text
      style={currentStyle}
      numberOfLines={numberOfLines}
      {...props}
      onTextLayout={onTextLayout}>
      {children}
    </Text>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    defaultTextStyle: {
      fontFamily: theme.themeObject.currentFontFamily.normal,
      fontSize: 10 * BW(),
      color: colors.textColor,
      textAlign: 'left',
    },
  });
