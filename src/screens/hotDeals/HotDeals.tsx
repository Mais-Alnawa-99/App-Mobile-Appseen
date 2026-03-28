import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Header from '../../component/Header';
import {getBaseURL} from '../../redux/network/api';
import {useTranslation} from 'react-i18next';
import Loader from '../../component/Loader';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {BW, BH, spacing} from '../../style/theme';
import Text from '../../component/Text';
import {getHotDeals} from '../../redux/reducers/hotDeals/thunk/hotDeals';
import Skeleton from 'react-native-reanimated-skeleton';
import FlatListComp from '../../component/FlatList';
import ProductCard from '../home/homepage/ProductCard';
import Button from '../../component/Button';
function HotDeals(props: any): JSX.Element {
  let sellerId = props?.route?.params?.sellerId;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {isLoggedIn, authenticatedUser} = useAppSelector(state => state.auth);
  const {sessionPublic, sessionUser} = useAppSelector(state => state.session);
  const {data, hotLoading} = useAppSelector(state => state.HotDeals);
  const [loadingDone, setLoadingDone] = useState(false);
  const _getHotDeals = () => {
    if (authenticatedUser) {
      dispatch(
        getHotDeals({
          userId: authenticatedUser,
          sessionId: sessionUser ? sessionUser : '',
        }),
      );
    } else if (!!sessionPublic) {
      dispatch(getHotDeals({sessionId: sessionPublic?.toString()}));
    }
  };
  useEffect(() => {
    _getHotDeals();
  }, []);
  const renderItem = ({item, index}: {item: any; index: any}) => {
    const even = index % 2 == 0;
    return (
      <ProductCard
        product={item}
        index={index}
        style={{
          // marginLeft: !even ? spacing.l / 4 : 0,
          // marginRight: even ? spacing.l / 4 : 0,
          width: 170 * BW(),
          // marginTop: even ? spacing.l / 1.8 : 8,
          margin:4,
        }}
        containerStyle={{width: '100%', borderRadius: 8 * BW()}}
        loading={hotLoading}
      />
    );
  };
  const hasData = Array.isArray(data) && data.length > 0;

  useEffect(() => {
    if (!hotLoading) {
      const timer = setTimeout(() => setLoadingDone(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hotLoading]);

  const showNoData = loadingDone && !hasData;
  return (
    <View style={{flex: 1, backgroundColor: colors.gray + '22'}}>
      <Header hideDrawer title={t('hotDeals')} />
      <View
        style={{
          paddingHorizontal: spacing.l / 2 * BW(),
          paddingVertical: spacing.l / 4 * BW(),
          flex:
            hotLoading || !(data && Array.isArray(data) && data?.length > 0)
              ? 1
              : 0,
        }}>
        {hotLoading ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 200 * BW(),
            }}>
            {Array.from({length: 6}).map((_, index) => {
              const even = index % 2 === 0;
              return (
                <Skeleton
                  key={`skeleton-${index}`}
                  containerStyle={{
                    flexDirection: 'column',
                    borderRadius: 8 * BW(),
                    // width: 160 * BW(),
                    // marginRight: 6 * BW(),
                    backgroundColor: colors.background,
                    borderWidth: 0.3 * BW(),
                    borderColor: colors.border,
                    marginLeft: !even ? spacing.l / 4 * BW() : 0,
                    marginRight: even ? spacing.l / 4 * BW() : 0,
                    width: 170 * BW(),
                    marginTop: even ? spacing.l / 1.8* BW() : 8* BW(),
                  }}
                  isLoading={true}
                  layout={[
                    {
                      key: 'productContainer',
                      width: '100%',
                      height: 190 * BH(),
                    },
                    {
                      key: 'prodInfo',
                      padding: 6 * BW(),
                      paddingHorizontal: 8 * BW(),
                      children: [
                        {
                          key: 'productName',
                          width: 100 * BW(),
                          height: 8 * BW(),
                          marginBottom: 2 * BW(),
                        },
                        {
                          key: 'rowContainer',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          children: [
                            {
                              key: 'catName',
                              width: 60 * BW(),
                              height: 10 * BW(),
                            },
                            {
                              key: 'cart',
                              width: 35 * BW(),
                              height: 35 * BH(),
                            },
                          ],
                        },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        ) : hasData ? (
          <View style={{marginBottom: 64 * BW()}}>
            <FlatListComp
              data={data}
              renderItem={renderItem}
              listkey={'-'}
              numColumns={2}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
        ) : showNoData ? (
          <View style={styles.noData}>
            <Button
              style={{backgroundColor: 'transparent'}}
              styleIcon={styles.noDataIcon}
              icon={require('../../../src/assets/header/search.png')}
            />
            <Text h2 style={{textAlign: 'center', color: colors.gray}}>
              {t('noHotDeals')}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
export default HotDeals;
const getStyle = (colors: any) =>
  StyleSheet.create({
    noData: {
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingHorizontal: 20 * BW(),
    },
    noDataIcon: {
      width: 40 * BW(),
      height: 40 * BW(),
      tintColor: colors.gray,
    },
    flatListContainer: {
      paddingBottom: 20 * BW(),
    },
  });
