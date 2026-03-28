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
import LinearGradient from 'react-native-linear-gradient';
import {Rating} from 'react-native-ratings';
import NavigationService from '../../../naigation/NavigationService';

function CustomerReviews(props: any): JSX.Element {
  const {productRatings, style} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text h4 bold style={{color: colors.textGray, marginVertical: 2 * BW()}}>
        {t('customerReviews')}
      </Text>
      <View style={[{height: 150, overflow: 'hidden'}, style]}>
        {Array.isArray(productRatings) &&
          productRatings?.map((rating, index) => {
            let starColor;
            switch (rating?.rating_value) {
              case 1.0:
                starColor = 'red';
                break;
              case 2.0:
                starColor = '#FF8A00';
                break;
              case 3.0:
                starColor = '#E1B664';
                break;
              case 4.0:
                starColor = '#9ABB2C';
                break;
              case 5.0:
                starColor = '#00A389';
                break;
              default:
                starColor = '#f1c40e';
            }

            return (
              <View key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 8 * BW(),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10 * BW(),
                    }}>
                    <View
                      style={{
                        width: 40 * BW(),
                        height: 40 * BW(),
                        borderRadius: 20 * BW(),
                        backgroundColor: colors.gray + 'aa',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../../../assets/bottomTab/profile.png')}
                        style={{width: 25 * BW(), height: 25 * BH()}}
                      />
                    </View>
                    <View>
                      <Text h4 bold>
                        {rating?.author_id[1]}
                        {/* Seen Store */}
                      </Text>
                      <Rating
                        type="custom"
                        startingValue={rating?.rating_value}
                        imageSize={18}
                        ratingColor={starColor}
                        ratingBackgroundColor={'#D2D7DF'}
                        readonly
                        style={styles.rating}
                      />
                    </View>
                  </View>
                  <Text h4 bold style={{color: colors.gray}}>
                    {rating?.date}
                  </Text>
                </View>
                <Text h5>{rating?.preview}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}

export default CustomerReviews;
const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16 * BW(),
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 50 * BH(),
    },
    nextIcon: {
      width: 15 * BW(),
      height: 15 * BH(),
      resizeMode: 'contain',
      tintColor: colors.backgroundDark,
    },
  });
