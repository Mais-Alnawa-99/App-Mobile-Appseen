import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Text, StyleSheet, I18nManager} from 'react-native';
import {isArabic} from '../locales';
import {BW} from '../style/theme';

const AnimatedDigit = ({target}: {target: number}) => {
  const [prev, setPrev] = useState(target - 2);
  const [current, setCurrent] = useState(target);
  const translatePrev = useRef(new Animated.Value(0)).current;
  const translateNext = useRef(new Animated.Value(30)).current;
  const opacityPrev = useRef(new Animated.Value(1)).current;
  const opacityNext = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;

      setPrev(target - 2);
      setCurrent(target);

      translatePrev.setValue(0);
      translateNext.setValue(30);
      opacityPrev.setValue(1);
      opacityNext.setValue(0);

      Animated.parallel([
        Animated.timing(translatePrev, {
          toValue: -30,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityPrev, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateNext, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityNext, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animate();

    const interval = setInterval(animate, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [target]);

  return (
    <View style={{width: 16 * BW(), height: 40, overflow: 'hidden'}}>
      <Animated.Text
        style={[
          styles.text,
          {
            position: 'absolute',
            transform: [{translateY: translatePrev}],
            opacity: opacityPrev,
          },
        ]}>
        {prev}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.text,
          {
            position: 'absolute',
            transform: [{translateY: translateNext}],
            opacity: opacityNext,
          },
        ]}>
        {current}
      </Animated.Text>
    </View>
  );
};

const AnimatedCounter = ({number}: {number: number}) => {
  const str = String(number);
  const tens = parseInt(str[str.length - 2] || '0', 10);
  const ones = parseInt(str[str.length - 1] || '0', 10);

  return (
    <View
      style={{
        flexDirection: isArabic() ? 'row-reverse' : 'row',
      }}>
      <AnimatedDigit target={tens} />
      <Text style={[styles.text]}>{ones}</Text>
      <Text style={styles.text}>%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -2,
  },
});

export default AnimatedCounter;
