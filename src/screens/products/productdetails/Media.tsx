import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dimensions} from 'react-native';
import CustomImage from '../../../component/CustomImage';
import {BaseURL, URL} from '../../../redux/network/api';
import CarouselFlatList from '../../../component/CarouselFlatList';
import {BH, BW} from '../../../style/theme';
import Video from 'react-native-video';
import Loader from '../../../component/Loader';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {
  addToWishlist,
  deleteFromWishlist,
} from '../../../redux/reducers/wishlist/thunk/add_delete';
import {setQuantityWishlist} from '../../../redux/reducers/wishlist/slice/quantityWishlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from '@react-navigation/native';
import Button from '../../../component/Button';
import {isArabic} from '../../../locales';
import {onShare} from '../../../component/Generalfunction';
import {Image} from 'react-native-elements';
function Media(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const itemHeight = windowHeight * 0.7;
  const {data, mainImage, product_id} = props;
  const {isLoggedIn, authenticatedUser} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const {sessionPublic, sessionUser} = useAppSelector(state => state.session);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(data?.is_in_wishlist);
  const [wishId, setWishId] = useState(data.wish_id);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const carouselData = [
    {img_url_1920: mainImage, video_url: '', embed_code: ''},
    ...(data?.media || []),
  ];
  const renderItem = ({
    item,
    index,
    isActive,
  }: {
    item: any;
    index: number;
    isActive: boolean;
  }) => {
    const imageFullPath = URL + item?.img_url_1920;
    const videoFullPath = URL + item?.video_url;

    return (
      <View style={{height: '100%', width: windowWidth}}>
        {item?.img_url_1920 && !item?.video_url && (
          <CustomImage
            url={imageFullPath}
            resizeMode={'stretch'}
            style={styles.image}
          />
        )}

        {item?.video_url && (
          <View>
            <Video
              source={{uri: videoFullPath}}
              style={styles.image}
              resizeMode={'cover'}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
              paused={!isActive}
            />
            <Loader
              isLoading={isLoading}
              style={styles.loaderContainer}
              color={'#fff'}
              size={40}
            />
          </View>
        )}
      </View>
    );
  };
  const toggleWishlist = () => {
    if (isInWishlist) {
      _deleteFromWishlist();
    } else {
      _addToWishlist();
    }
  };
  const _addToWishlist = () => {
    if (authenticatedUser) {
      dispatch(
        addToWishlist({
          user_id: isLoggedIn ? authenticatedUser.toString() : null,
          product_id: props.product_id,
          session_id: sessionUser ? sessionUser : '',
          home_page: true,
        }),
      ).then(res => {
        if (
          res.meta.requestStatus == 'fulfilled' &&
          res?.payload?.result?.status == 'success'
        ) {
          setWishId(res?.payload?.result?.wishlist_item_id);
          setIsInWishlist(true);
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.count,
            }),
          );
        }
      });
    } else if (!!sessionPublic) {
      dispatch(
        addToWishlist({
          session_id: sessionPublic ? sessionPublic : '',
          product_id: props.product_id,
          home_page: true,
        }),
      ).then(res => {
        if (
          res.meta.requestStatus == 'fulfilled' &&
          res?.payload?.result?.status == 'success'
        ) {
          setWishId(res?.payload?.result?.wishlist_item_id);
          setIsInWishlist(true);
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.count,
            }),
          );
        }
      });
    }
  };
  const _deleteFromWishlist = () => {
    if (authenticatedUser) {
      dispatch(
        deleteFromWishlist({
          user_id: authenticatedUser,
          session_id: sessionUser ? sessionUser : '',
          wish_id: wishId.toString(),
        }),
      ).then(res => {
        if (res?.payload?.result?.type == 'calledSuccessfully') {
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.data?.count,
            }),
          );
          setIsInWishlist(false);
        }
      });
    } else if (!!sessionPublic) {
      dispatch(
        deleteFromWishlist({
          session_id: sessionPublic ? sessionPublic : '',
          wish_id: wishId.toString(),
        }),
      ).then(res => {
        if (res?.payload?.result?.type == 'calledSuccessfully') {
          dispatch(
            setQuantityWishlist({
              quantityInWishlist: res?.payload?.result?.data?.count,
            }),
          );

          setIsInWishlist(false);
        }
      });
    }
    // dispatch(
    //   deleteFromWishlist({
    //     user_id: isLoggedIn ? authenticatedUser.toString() : null,
    //     wish_id: wishId,
    //   }),
    // ).then(res => {
    //   if (
    //     res.meta.requestStatus == 'fulfilled' &&
    //     res?.payload?.result?.status == 'success'
    //   ) {
    //     setIsInWishlist(false);
    //   }
    // });
  };
  const _onShare = () => {
    let title = isArabic() ? data?.name_ar : data?.name_en;
    let description_sale = isArabic()
      ? data?.description_sale_ar
      : data?.description_sale_en;
    let msg = description_sale + '\n' + `${BaseURL}${data.product_url}`;
    onShare({title, message: msg});
  };
  return (
    <>
      <View>
        <CarouselFlatList
          data={carouselData}
          height={itemHeight}
          width={windowWidth}
          renderItem={({item, index}) =>
            renderItem({item, index, isActive: index === activeIndex})
          }
          mode="normal-horizontal"
          scrollAnimationDuration={1000}
          style={{width: windowWidth}}
          autoPlay={false}
          containerStyle={{bottom: -20 * BW()}}
          pagingEnabled
          loop={true}
          onMomentumScrollEnd={e => {
            const newIndex = Math.round(
              e.nativeEvent.contentOffset.x / windowWidth,
            );
            setActiveIndex(newIndex);
          }}
        />
        <TouchableOpacity
          style={[styles.square, styles.btnCotainer]}
          onPress={toggleWishlist}>
          {isInWishlist ? (
            <AntDesign name="heart" size={17 * BW()} color="#f00" />
          ) : (
            <AntDesign name="hearto" size={17 * BW()} color="#000" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnContainerWithBorder, styles.btnCotainer]}
          onPress={_onShare}>
          <Image
            source={require('../../../assets/icons/share.png')}
            style={{
              width: 20 * BW(),
              height: 20 * BW(),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
export default Media;
const getStyle = (colors: any) =>
  StyleSheet.create({
    Container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      backgroundColor: '#fff',
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
    },
    loaderContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: ' #fff',
    },
    square: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      top: 10 * BH(),
    },
    btnContainerWithBorder: {
      top: 60 * BW(),
    },
    btnCotainer: {
      position: 'absolute',
      right: 14 * BW(),
      height: 40 * BW(),
      width: 40 * BW(),
      // borderWidth: 1 * BW(),
      borderColor: colors.gray + 'cc',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8 * BW(),
      zIndex: 10,
      backgroundColor: '#ffffffb3'
    },
  });
