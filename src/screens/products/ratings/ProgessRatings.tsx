import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {Rating} from 'react-native-ratings';
import ProgressBar from 'react-native-progress/Bar';

function ProgressRatings(props: any): JSX.Element {
  const {averageRating, ratingStars} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const percentages = Object.values(ratingStars?.percent).map(
    (percentage: number) => percentage / 100,
  );
  return (
    <>
      <View style={{paddingTop: 16 * BW()}}></View>
      <View style={styles.container}>
        {Object.entries(ratingStars?.percent).map(
          ([key, percentage], index) => {
            let barColor;
            switch (key) {
              case '1':
                barColor = 'red';
                break;
              case '2':
                barColor = '#FF8A00';
                break;
              case '3':
                barColor = '#E1B664';
                break;
              case '4':
                barColor = '#9ABB2C';
                break;
              case '5':
                barColor = '#00A389';
                break;
              default:
                barColor = colors.gray;
            }

            return (
              <View key={key} style={styles.rowContainer}>
                <View style={styles.itemContainer}>
                  <Text h3 bold>
                    {key}
                  </Text>
                  <Image
                    source={require('../../../assets/icons/star.png')}
                    style={{width: 18, height: 20, tintColor: barColor}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <ProgressBar
                    progress={percentages[index]}
                    width={null}
                    height={10 * BH()}
                    color={barColor}
                    borderWidth={0}
                    borderRadius={50}
                    unfilledColor={'white'}
                  />
                </View>
              </View>
            );
          },
        )}
      </View>
    </>
  );
}

export default ProgressRatings;
const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      paddingTop: 16 * BW(),
      borderTopColor: colors.gray + 'cc',
      borderTopWidth: 1,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10 * BW(),
      marginBottom: 2 * BW(),
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10 * BW(),
    },
  });
