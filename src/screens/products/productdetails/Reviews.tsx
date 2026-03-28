import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {getProductRatings} from '../../../redux/reducers/ratings/thunk/ratingsThunk';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import NavigationService from '../../../naigation/NavigationService';
import OverallRatings from '../ratings/OverallRatings';
import CustomerReviews from '../ratings/CustomerReviews';
import Loader from '../../../component/Loader';

function Reviews(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const [offset, setOffset] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const limit = 3;
  const dispatch = useAppDispatch();
  const {authenticatedUser} = useAppSelector(state => state.auth);
  const {prodId} = props;
  const _getProductRatings = async (
    userId: number,
    resId: number,
    offset: number,
  ) => {
    try {
      await dispatch(
        getProductRatings({
          userId: userId,
          resId: resId,
          limit: limit,
          offset: offset,
        }),
      );
    } catch (error) {
      console.error('Failed to fetch product ratings:', error);
    }
  };

  const {productRatings, productRatingsCount, loadingRatings, ratingStars} =
    useAppSelector(state => state.productRatings);

  useEffect(() => {
    _getProductRatings(authenticatedUser, prodId, offset);
    setAverageRating(ratingStars?.avg || 0);
  }, []);
  return (
    <Loader isLoading={loadingRatings}>
      <View
        style={{
          borderTopColor: '#E7E7E7',
          borderTopWidth: 1 * BW(),
        }}>
        <OverallRatings averageRating={averageRating} />
        {productRatings?.length > 0 && (
          <>
            <CustomerReviews productRatings={productRatings} />
            <LinearGradient
              colors={['#FFFFFF88', '#FFFFFF88', '#FFFFFF88', '#FFFFFF']}
              style={styles.gradient}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                  height: '100%',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    NavigationService.navigate('ProductRatings', {item: prodId})
                  }
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4 * BW(),
                  }}>
                  <Text h3 bold>
                    {t('viewAll')}
                  </Text>
                  <Image
                    source={require('../../../assets/icons/next.png')}
                    style={styles.nextIcon}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </>
        )}
      </View>
    </Loader>
  );
}

export default Reviews;
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
