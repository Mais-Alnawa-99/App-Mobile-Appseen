import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import CustomImage from '../../../component/CustomImage';
import {useTheme} from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';
import NavigationService from '../../../naigation/NavigationService';
import Skeleton from 'react-native-reanimated-skeleton';
interface Data {
  name: string;
  cat_img_link: string;
}
interface CategoriesProps {
  data: Data[];
  baseUrl: string;
  isLoading: boolean;
}
function Categories(props: CategoriesProps): JSX.Element {
  const {data, baseUrl, isLoading} = props;
  const reversedData = [...data].reverse();
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const renderItem = ({item, index}: {item: any; index: number}) => {
    const imageFullPath = baseUrl + item.cat_img_link;
    return (
      <Animatable.View
        duration={1000}
        delay={150}
        animation={'zoomIn'}
        key={index}>
        <TouchableOpacity
          onPress={() =>
            NavigationService.navigate('Shop', {
              searchString: item?.name,
              cat_id: item?.id ? item.id : null,
              with_child: true,
            })
          }
          style={styles.categoriesContainer}>
          <View style={[styles.categoriesCircle]}>
            <CustomImage
              url={imageFullPath}
              resizeMode={'contain'}
              style={styles.categoriesImage}
            />
          </View>
          <Text
            h4
            numberOfLines={2}
            style={{
              maxWidth: 180 * BW(),
              textAlign: 'center',
              marginTop: 8 * BW(),
              color: '#6F6F6F',
              lineHeight: 17 * BW(),
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlatListComp
          data={reversedData}
          renderItem={renderItem}
          contentContainerStyle={{alignSelf: 'flex-start'}}
          numColumns={Math.ceil(data.length / 2)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingLeft: 16 * BW(),
      flex: 1,
      backgroundColor: colors.background,
    },
    categoriesContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 8 * BW(),
      marginRight: 12 * BW(),
      marginTop: 0,
      width: 85 * BW(),
    },
    categoriesCircle: {
      padding: 8 * BW(),
      marginHorizontal: 4,
      borderRadius: 65 * BW(),
      height: 95 * BH(),
      width: '100%',
      backgroundColor: colors.categBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoriesImage: {
      width: 70 * BW(),
      height: 70 * BW(),
      maxHeight: 70 * BW(),
      maxWidth: 70 * BW(),
      resizeMode: 'contain',
    },
  });
export default Categories;
