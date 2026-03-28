import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList, Image} from 'react-native';
import ProductCard from '../home/homepage/ProductCard';
import {BW} from '../../style/theme';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../component/FlatList';
import LinearGradientCustom from '../../component/LinearGradient';
import Header from '../../component/Header';

function AllProducts(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  let params = props?.route?.params;

  const {data, title} = params;

  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProductCard
      product={item}
      index={index}
      style={{width: '49%', marginRight: 0 * BW()}}
    />
  );

  return (
    <View style={{flex: 1}}>
      <Header
        title={title}
        showSerach
        hideDrawer
        showCart
        hideNotification
        titleContainerStyle={{marginLeft: 8 * BW()}}
      />
      <LinearGradientCustom style={styles.appContainer}>
        <FlatListComp
          data={data}
          renderItem={renderItem}
          listkey={'-'}
          contentContainerStyle={styles.container}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.container}
        />
      </LinearGradientCustom>
    </View>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10 * BW(),
      paddingRight: 16 * BW(),
      paddingBottom: 16 * BW(),
    },
    container: {
      gap: 6 * BW(),
      justifyContent: 'space-between',
    },
  });
export default AllProducts;
