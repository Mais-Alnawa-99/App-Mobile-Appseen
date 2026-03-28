import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {BW} from '../../../style/theme';
import CustomImage from '../../../component/CustomImage';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';
import SectionTitle from './SectionTitle';
import LinearGradient from 'react-native-linear-gradient';
import {getBaseURL} from '../../../redux/network/api';
import NavigationService from '../../../naigation/NavigationService';

function FeaturedStores(props: any): JSX.Element {
  const {data} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);

// console.log('item.seller_id,', JSON.stringify(item.seller_id,, null, 2));


  const renderItem = ({item, index}: {item: Data; index: number}) => {
    const imageFullPath = getBaseURL() + item?.seller_img_link;
    const fullUrl = getBaseURL() + item?.url;
    return (
      <>
        <TouchableOpacity
          style={styles.mainCategory}
          // onPress={() => {
          //   NavigationService.navigate('WebViewScreen', {url: fullUrl});
          // }}
          onPress={() => {
            NavigationService.navigate('SellerProfile', {
              sellerId: item.marketplace_seller_id[0],});
          }}
        >
          <CustomImage
            url={imageFullPath}
            resizeMode={'contain'}
            style={styles.mainImage}
          />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <LinearGradient
      colors={['#FFF', '#ECECEC', '#ECECEC', '#ECECEC']}
      locations={[0, 0.381, 0.681, 0.9084]}
      style={{paddingLeft: 16 * BW(), paddingBottom: 16 * BW()}}>
      {data?.display_title ? <SectionTitle data={data} /> : null}
      <FlatListComp
        data={data?.data}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={{gap: 8 * BW()}}
        showsHorizontalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    mainCategory: {
      height: 110 * BW(),
      width: 110 * BW(),
      borderRadius: 8 * BW(),
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainImage: {
      width: 90 * BW(),
      height: 90 * BW(),
      resizeMode: 'contain',
    },
  });
export default FeaturedStores;
