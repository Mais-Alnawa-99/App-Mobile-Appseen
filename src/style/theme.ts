import {Dimensions, Platform} from 'react-native';
import {store, useAppSelector} from '../redux/store';
import reactotron from '../redux/reactotron';
import {overlay} from 'reactotron-react-native';

let width: number = Dimensions.get('window').width;
let height: number = Dimensions.get('window').height;

const getWidth = () => {
  const deviceDeminsions = store?.getState().dimensions.width;

  if (!deviceDeminsions) return width;
  return width;
};

const getHeight = () => {
  const deviceDeminsions = store?.getState().dimensions.height;

  if (!deviceDeminsions) return height;
  return height;
};
const isPortrait = () => {
  return getHeight() >= getWidth();
};
export function BW(): number {
  if (isPortrait()) {
    return getWidth() / 375;
  } else {
    return getWidth() / 910;
  }
}
export function BH(): number {
  if (isPortrait()) {
    return getHeight() / 910;
  } else {
    return getHeight() / 375;
  }
}

const shadow = {
  ...Platform.select({
    ios: {
      shadowColor: 'rgba(0, 0, 0)',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
    },
    android: {
      elevation: 4,
    },
  }),
};
export const MyTheme = {
  dark: false,
  colors: {
    primaryColor: '#303030',
    secondaryColor: '#326869',
    mainBackground: '#F6F6F6',
    background: '#fff',
    darkgreen: '#3B7272',
    black: '#000',
    textColor: '#303030',
    green: '#00A389',
    gray: '#B4B4B4',
    primary: '#303030',
    card: '#F5F6FA',
    text: '#2B2B2B',
    border: '#D9D9D9',
    notification: 'rgb(255, 69, 58)',
    lightgray: '#DEE0E1',
    lightRed: 'rgba(229, 108, 108, 1)',
    darkWhite: '#FEFEFE',
    lightGold: 'rgba(190, 150, 97, 0.08)',
    blue: '#8BBDEC',
    golden: '#CE9C56',
    backgroundColorInput: '#fff',
    textGray: '#A6A6A6',
    backgroundDark: '#3D3D3D',
    darkGray: '#F1F3F6',
    ratingBackground: '#F1F3F6',
    softGold: '#F8E2C8',
    goldeText: '#CE9C56',
    yellow: '#FFB74A',
    red: '#EF0E0E',
    darkBorder: '#575757',
    overlay: 'rgba(0,0,0,0.5)',
    categBg: '#F5F5F5',
    fasionText: '#fff',
    activeBottomTabs: '#CE9C56',
    badgeBottomTabs: '#EF0E0E',
  },
};

export const MyThemeBlue = {
  dark: false,
  colors: {
    primaryColor: 'blue',
    secondaryColor: '#326869',
    mainBackground: '#F5F6FA',
    background: '#fff',
    black: '#000',
    textColor: '#2B2B2B',
    gray: '#B4B4B4',
    green: '#377374',
    yearBackground: '#90A6A433',
    yearTitle: '#90A6A4',
    primary: '#C79D65',
    card: '#F5F6FA',
    text: '#2B2B2B',
    border: '#C79D65',
    notification: 'rgb(255, 69, 58)',
    lightgray: '#DEE0E1',
    lightRed: 'rgba(229, 108, 108, 1)',
    darkWhite: '#FEFEFE',
    lightGold: 'rgba(190, 150, 97, 0.08)',
  },
};
export const DarkTheme = {
  dark: true,
  colors: {
    primaryColor: '#C79D65',
    secondaryColor: '#326869',
    mainBackground: '#2B2B2B',
    background: '#000',
    black: '#fff',
    textColor: '#fff',
    gray: '#fff',
    yearBackground: '#fff',
    yearTitle: '#fff',
    primary: '#fff',
    card: '#fff',
    text: '#fff',
    border: '#C79D65',
    notification: 'rgb(255, 69, 58)',
    lightgray: '#DEE0E1',
    lightRed: 'rgba(229, 108, 108, 1)',
    green: '#377374',
    darkWhite: '#FEFEFE',
    lightGold: 'rgba(190, 150, 97, 0.08)',
  },
};

export const nationalDayTheme = {
  dark: false,
  colors: {
    primaryColor: '#303030',
    secondaryColor: '#326869',
    mainBackground: '#F6F6F6',
    background: '#fff',
    darkgreen: '#3B7272',
    black: '#000',
    textColor: '#303030',
    green: '#00A389',
    gray: '#B4B4B4',
    primary: '#303030',
    card: '#F5F6FA',
    text: '#2B2B2B',
    border: '#D9D9D9',
    notification: 'rgb(255, 69, 58)',
    lightgray: '#DEE0E1',
    lightRed: 'rgba(229, 108, 108, 1)',
    darkWhite: '#FEFEFE',
    lightGold: 'rgba(190, 150, 97, 0.08)',
    blue: '#8BBDEC',
    golden: '#2DA84D',
    backgroundColorInput: '#fff',
    textGray: '#A6A6A6',
    backgroundDark: '#3D3D3D',
    darkGray: '#F1F3F6',
    ratingBackground: '#F1F3F6',
    softGold: '#F8E2C8',
    goldeText: '#CE9C56',
    yellow: '#FFB74A',
    red: '#EF0E0E',
    darkBorder: '#575757',
    overlay: 'rgba(0,0,0,0.5)',
    categBg: '#DCEECD',
    fasionText: '#303030',
    activeBottomTabs: '#2DA84D',
    badgeBottomTabs: '#2DA84D',
  },
};

const goldColors = MyTheme.colors;

const normalFontSize = {
  h1: 18 * BW(),
  h2: 16 * BW(),
  h3: 14 * BW(),
  h4: 12 * BW(),
  h5: 10 * BW(),
  h6: 8 * BW(),
};

export const normalMontserratFontSize = {
  h1: 15 * BW(),
  h2: 13 * BW(),
  h3: 11 * BW(),
  h4: 9.5 * BW(),
};

const mediumFontSize = {
  h1: 17 * BW(),
  h2: 15 * BW(),
  h3: 13 * BW(),
  h4: 11 * BW(),
};

const largFontSize = {
  h1: 20 * BW(),
  h2: 18 * BW(),
  h3: 15 * BW(),
  h4: 13 * BW(),
};

const fontTypeNormal = {
  normal: Platform.OS == 'android' ? '' : 'anticon',
  bold: Platform.OS == 'android' ? '' : 'anticon',
};

const fontTypeGESS = {
  normal: Platform.OS == 'android' ? 'GESSTwoLight' : 'GESSTwoMedium-Medium',
  bold: Platform.OS == 'android' ? 'GESSTwoMedium' : 'GESSTwoBold-Bold',
};

const fontTypeKufi = {
   normal: 'DroidArabicKufi-regular',
   bold:
    Platform.OS == 'android' ? 'DroidArabicKufi-bold' : 'Montserrat-Arabic-Bold',
};

const fontTypeMontserrat = {
  normal: 'Montserrat-Arabic-Regular',
  bold: 'Montserrat-Arabic-Bold',
};

const themeObject = {
  currentFontFamily: fontTypeKufi,
  fontFamily: 'droidArabic',
  currentFontSize: normalFontSize,
  fontSize: 'normal',
  colors: goldColors,
  currentTheme: 'brown',
};
export const spacing = {
  s: 8,
  m: 18,
  l: 24,
  xl: 40,
};
export default {
  themeObject,
  shadow,
  normalMontserratFontSize,
};
