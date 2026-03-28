import React, {useState, ReactNode} from 'react';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '@react-navigation/native';
import Animated, {Easing, withSpring} from 'react-native-reanimated';

import {BH, BW} from '../style/theme';
import Text from './Text';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
interface AccordionProps {
  title: string;
  children: ReactNode;
}
const Accordion: React.FC<AccordionProps> = ({title, children}) => {
  const [expanded, setExpanded] = useState(false);
  const height = expanded ? 'auto' : 0;
  const {colors} = useTheme();
  const styles = getStyle(colors);

  const animationConfig = {
    duration: 400,
    create: {
      type: LayoutAnimation.Types.easeIn,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeIn,
    },
    delete: {
      type: LayoutAnimation.Types.easeOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(animationConfig);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleAccordion}
        style={expanded ? styles.headerExpanded : styles.header}>
        <Text h3>{title}</Text>
        <Animatable.View
          animation={{
            from: {
              rotate: expanded ? '0deg' : '180deg',
            },
            to: {
              rotate: expanded ? '180deg' : '0deg',
            },
          }}
          duration={400}
          useNativeDriver>
          <Image source={require('../assets/drawer/down.png')} />
        </Animatable.View>
      </TouchableOpacity>
      {expanded && (
        <View style={{overflow: 'hidden'}}>
          <View
            style={{
              borderStyle: 'dashed',
              borderWidth: 0.6 * BW(),
              borderColor: colors.primaryColor,
            }}
          />
        </View>
      )}
      {expanded && (
        <View style={{overflow: 'hidden'}}>
          <Animated.View style={[expanded ? styles.expandedBody : styles.body]}>
            {children}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: colors.primaryColor + '1A',
      width: '100%',
      height: 40 * BH(),
      marginTop: 8 * BW(),
      borderRadius: 12 * BW(),
      paddingHorizontal: 20 * BW(),
    },
    headerExpanded: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: colors.primaryColor + '1A',
      width: '100%',
      height: 40 * BH(),
      marginTop: 8 * BW(),
      borderTopEndRadius: 12 * BW(),
      borderTopStartRadius: 12 * BW(),
      paddingHorizontal: 20 * BW(),
    },
    body: {
      overflow: 'hidden',
      backgroundColor: colors.primaryColor + '09',
      borderBottomEndRadius: 12 * BW(),
      borderBottomStartRadius: 12 * BW(),
      padding: 12 * BW(),
    },
    expandedBody: {
      backgroundColor: colors.primaryColor + '09',
      borderBottomEndRadius: 12 * BW(),
      borderBottomStartRadius: 12 * BW(),
      paddingHorizontal: 12 * BW(),
    },
    iconContainer: {
      marginRight: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    content: {
      padding: 10,
    },
  });

export default Accordion;
