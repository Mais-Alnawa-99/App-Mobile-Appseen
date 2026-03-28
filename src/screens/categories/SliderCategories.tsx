import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Header from '../../component/Header';
import {useTranslation} from 'react-i18next';

function SliderCategories(): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {
    offsetMainData,
    mainCategories,
    mainDataLoader,
    moredataMainLoading,
    totalMainPages,
  } = useAppSelector(state => state.products.mainCategories);
  return <View></View>;
}
export default SliderCategories;

const getStyle = (colors: any) => StyleSheet.create({});
