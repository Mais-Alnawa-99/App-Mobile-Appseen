import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { navigationRef } from './NavigationService';
import { useAppSelector } from '../redux/store';
import LanguageNavigator from './LanguageNavigator';
import BottomTabs from './tabs/BottomTab';
import theme from '../style/theme';
import CustomModal from '../component/Modal';

const AppNavigator = ({ navigation, route }: any) => {
  const { selectedLang } = useAppSelector(state => state.lang);
  const { themeData } = useAppSelector(state => state.theme);
  const dynamicTheme = {
    ...DefaultTheme,
    dark: false,
    fonts: {
      regular: { fontFamily: theme.themeObject.currentFontFamily.normal },
      bold: { fontFamily: theme.themeObject.currentFontFamily.bold },
    },
    colors: {
      ...DefaultTheme.colors,
      primaryColor: themeData?.primary_color || '#303030',
      secondaryColor: themeData?.secondary_color || '#326869',
      mainBackground: themeData?.main_background || '#F6F6F6',
      background: themeData?.background || '#fff',
      darkgreen: themeData?.dark_green || '#3B7272',
      black: themeData?.black || '#000',
      textColor: themeData?.text_color || '#303030',
      green: themeData?.green || '#00A389',
      gray: themeData?.gray || '#B4B4B4',
      primary: themeData?.primary || '#303030',
      card: themeData?.card || '#F5F6FA',
      text: themeData?.text || '#2B2B2B',
      border: themeData?.border || '#D9D9D9',
      notification: themeData?.notification || 'rgb(255, 69, 58)',
      lightgray: themeData?.light_gray || '#DEE0E1',
      lightRed: themeData?.light_red || 'rgba(229, 108, 108, 1)',
      darkWhite: themeData?.dark_white || '#FEFEFE',
      lightGold: themeData?.lightGold || 'rgba(190, 150, 97, 0.08)',
      blue: themeData?.blue || '#8BBDEC',
      golden: themeData?.golden || '#CE9C56',
      backgroundColorInput: themeData?.background_color_input || '#fff',
      textGray: themeData?.text_gray || '#A6A6A6',
      backgroundDark: themeData?.background_dark || '#3D3D3D',
      darkGray: themeData?.dark_gray || '#F1F3F6',
      ratingBackground: themeData?.rating_background || '#F1F3F6',
      softGold: themeData?.soft_gold || '#F8E2C8',
      goldeText: themeData?.golde_text || '#CE9C56',
      yellow: themeData?.yellow || '#FFB74A',
      red: themeData?.red || '#EF0E0E',
      darkBorder: themeData?.dark_border || '#575757',
      overlay: themeData?.overlay || 'rgba(0,0,0,0.5)',
      categBg: themeData?.categ_bg || '#F5F5F5',
      fasionText: themeData?.fasion_text || '#fff',
      activeBottomTabs: themeData?.active_bottom_tabs || '#CE9C56',
      badgeBottomTabs: themeData?.badge_bottom_tabs || '#EF0E0E',
    },
  };
  const getInitialRoot = () => {
    // if (!selectedLang) {
    // return <LanguageNavigator />;
    //   return <LanguageNavigator />;
    // }
    // else if (!skipedIntro) {
    //   if (Platform.OS == 'ios') {
    //     return <IntroPageIos />;
    //   } else {
    //     return <IntroPage />;
    //   }
    // }
    // else {
    return <BottomTabs />;
    // }
  };
  return (
    <NavigationContainer ref={navigationRef} theme={dynamicTheme}>
      {getInitialRoot()}
      <CustomModal />
    </NavigationContainer>
  );
};
export default AppNavigator;
