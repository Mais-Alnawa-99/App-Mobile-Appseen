import React from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {BW} from '../../../style/theme';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import NavigationService from '../../../naigation/NavigationService';

function Offers(props: any): JSX.Element {
  const data = props;

  const {colors} = useTheme();
  const styles = getStyle(colors);
  const renderItem = ({item, index}: {item: Data; index: number}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.offerContainer}
        onPress={() => {
          if (item?.loyalty_program_id?.length > 0) {
            NavigationService.navigate('Shop', {
              loyalty_program_id: item?.loyalty_program_id[0],
            });
          }
          if (item?.product_pricelist_item_id?.length > 0) {
            NavigationService.navigate('Shop', {
              product_pricelist_item_id: item?.product_pricelist_item_id[0],
            });
          }
        }}>
        <CustomImage
          url={getBaseURL() + item?.background}
          resizeMode={'cover'}
          style={styles.offerImage}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{width: Dimensions.get('screen').width}}>
      <FlatListComp
        data={data?.data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    offerContainer: {
      height: 150 * BW(),
      width: Dimensions.get('screen').width - 60 * BW(),
      marginRight: 8 * BW(),
      borderRadius: 8 * BW(),
      overflow: 'hidden',
    },

    offerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });
export default Offers;
