import React, {useEffect, useState, createRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import RenderHtmlComponent from '../../../component/renderHtml/RenderHtml';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {Image} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {getProductRatings} from '../../../redux/reducers/ratings/thunk/ratingsThunk';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {Rating} from 'react-native-ratings';
import OverallRatings from './OverallRatings';
import CustomerReviews from './CustomerReviews';
import Loader from '../../../component/Loader';
import Header from '../../../component/Header';
import {useRoute, RouteProp} from '@react-navigation/native';

function ProductRatings(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const [offset, setOffset] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [localProductRatings, setLocalProductRatings] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 3;
  const dispatch = useAppDispatch();
  const {authenticatedUser} = useAppSelector(state => state.auth);
  const productId = props?.route?.params?.item;
  const _getProductRatings = async (
    userId: number,
    resId: number,
    offset: number,
  ) => {
    try {
      setLoadingMore(true);
      const actionResult = await dispatch(
        getProductRatings({
          userId: userId,
          resId: resId,
          limit: limit,
          offset: offset,
        }),
      );
      const result = actionResult?.payload;

      if (result && result?.result && Array.isArray(result?.result?.data)) {
        const newRatings: Rating[] = result?.result?.data;
        setLocalProductRatings(prevRatings => [...prevRatings, ...newRatings]);
        setAverageRating(result?.result?.rating_stars?.avg);
      } else {
        console.error('Result data is not an array:', result);
      }
    } catch (error) {
      console.error('Failed to fetch product ratings:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    _getProductRatings(authenticatedUser, productId, 0);
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    if (newOffset <= productRatingsCount) {
      setOffset(newOffset);
      _getProductRatings(authenticatedUser, productId, newOffset);
    }
  };

  const {productRatingsCount, loadingRatings, ratingStars} = useAppSelector(
    state => state.productRatings,
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <Loader isLoading={loadingRatings}></Loader>;
  };
  return (
    <View style={{flex: 1}}>
      <Header
        searchCenter
        hideDrawer
        showShare
        showCart
        hideNotification
        hideTitle
      />
      <OverallRatings
        averageRating={averageRating}
        showCustomerRatings
        ratingStars={ratingStars}
      />
      <FlatList
        data={localProductRatings}
        renderItem={({item}) => (
          <CustomerReviews productRatings={[item]} style={{height: 'auto'}} />
        )}
        keyExtractor={item => item?.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
export default ProductRatings;
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
