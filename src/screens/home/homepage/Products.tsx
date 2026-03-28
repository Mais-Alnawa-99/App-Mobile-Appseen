import {StyleSheet, View, FlatList, Image, ScrollView} from 'react-native';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';
import {BW} from '../../../style/theme';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FlatListComp from '../../../component/FlatList';
import NavigationService from '../../../naigation/NavigationService';

function Products(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {data, alternative} = props;
  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProductCard
      product={item}
      index={index}
      alternative={alternative ? alternative : null}
    />
  );

  return (
    <LinearGradient
      colors={['#FFF', '#FFF', '#ECECEC', '#ECECEC']}
      locations={[0, 0.381, 0.781, 0.9084]}
      style={styles.appContainer}>
      {data?.display_title ? (
        <SectionTitle
          data={data}
          onPress={() =>
            NavigationService.navigate('AllProducts', {
              data: data?.data,
              title: data?.title,
            })
          }
        />
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlatListComp
          data={alternative ? data : data?.data}
          renderItem={renderItem}
          listkey={'#'}
          contentContainerStyle={{alignSelf: 'flex-start', gap: 6 * BW()}}
          numColumns={alternative ? data?.length : data?.data?.length}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      paddingLeft: 16 * BW(),
      paddingBottom: 16 * BW(),
    },
    container: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
  });
export default Products;
