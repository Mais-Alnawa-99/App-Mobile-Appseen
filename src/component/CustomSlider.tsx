import React, { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';

const CustomSlider = ({
  style,
  minimumValue,
  maximumValue,
  minimumTrackTintColor,
  maximumTrackTintColor,
  onValueChange,
  onSlidingComplete,
  thumbTintColor,
  value,
  ...props
}: {
  style?: object;
  minimumValue: number;
  maximumValue: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  onValueChange?: any;
  onSlidingComplete?: any;
  thumbTintColor?: string;
  value?: any;
}): JSX.Element => {
  return (
    <>
      <Slider
        style={style}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        onSlidingComplete={onSlidingComplete}
        onValueChange={onValueChange}
        value={value}
      ></Slider>
    </>
  );
};
export default CustomSlider;
