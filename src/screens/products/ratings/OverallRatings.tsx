import React, { useEffect, useState } from 'react';
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
import { BH, BW } from '../../../style/theme';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { Image } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import ProgressRatings from './ProgessRatings';
function OverallRatings(props: any): JSX.Element {
  const { showCustomerRatings = false, ratingStars = {} } = props;
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setAverageRating(props.averageRating);
      setLoading(false);
    }, 1000);
  }, [props.averageRating]);

  const roundedAverageRating =
    averageRating !== null ? parseFloat(averageRating.toFixed(2)) : null;
  return (
    <View style={styles.container}>
      <Text h3 bold>
        {t('Reviews')}
      </Text>
      <View
        style={{
          backgroundColor: colors.ratingBackground,
          padding: 16 * BW(),
          borderRadius: 10 * BW(),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10 * BW(),
          }}
        >
          <Text
            h4
            bold
            style={{ color: colors.textGray, marginVertical: 2 * BW() }}
          >
            {t('OverallRating')}
          </Text>
          <Rating
            type="custom"
            startingValue={roundedAverageRating || 0}
            imageSize={22}
            readonly
            ratingColor={'#9ABB2C'}
            ratingBackgroundColor={'#D2D7DF'}
            tintColor={colors.ratingBackground}
          />
          <Text h3 bold>
            {roundedAverageRating || 0}
          </Text>
        </View>
        {showCustomerRatings && <ProgressRatings ratingStars={ratingStars} />}
      </View>
    </View>
  );
}

export default OverallRatings;
const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 16 * BW(),
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
