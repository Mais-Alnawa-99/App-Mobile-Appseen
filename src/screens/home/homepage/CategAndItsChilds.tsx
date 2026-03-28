import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../../component/Text';
import {BW} from '../../../style/theme';
import Button from '../../../component/Button';
import {isArabic} from '../../../locales';
import NavigationService from '../../../naigation/NavigationService';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {getBaseURL} from '../../../redux/network/api';
import CustomImage from '../../../component/CustomImage';

function CategAndItsChilds(props: any): JSX.Element {
  const {data} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  // let data = {
  //   title: 'سيبس',
  //   display_title: false,
  //   type: 'fashion',
  //   data: {
  //     image_name: 'Mobile',
  //     images_data: [
  //       {
  //         image: require('../../../assets/media/women.png'),
  //         url: '/shop/category/52',
  //       },
  //       {
  //         image: require('../../../assets/media/men.png'),
  //         url: '/shop/category/51',
  //       },
  //       {
  //         image: require('../../../assets/media/kids.png'),
  //         url: '/shop/category/53',
  //       },
  //     ],
  //     main_data: {
  //       main_image: require('../../../assets/media/bg.png'),
  //       url: '/shop/category/50',
  //       title: 'Fashion & Shoes',
  //       description: 'Select your Favourite',
  //       url_button: false,
  //     },
  //   },
  //   id: 41,
  //   items_counts: {},
  //   link_title: false,
  //   display_quick_link: false,
  //   link: '',
  // };
  return (
    <View style={{marginBottom: 8 * BW(), gap: 6 * BW()}}>
      <View style={styles.mainCategory}>
        <CustomImage
          url={getBaseURL() + data?.data.main_data?.main_image}
          resizeMode={'cover'}
          style={styles.mainImage}
        />
        <View style={styles.categoryContent}>
          <View>
            <Text
              h1
              bold
              style={{
                color: colors.fasionText,
                width: 100 * BW(),
                lineHeight: 25 * BW(),
              }}>
              {data?.data?.main_data?.title}
            </Text>
            <Text h4 style={{color: colors.fasionText, width: 90 * BW()}}>
              {data?.data?.main_data?.description}
            </Text>
            <Button
              style={styles.btn}
              title={t('shopNow')}
              containerIcon={{
                width: 14 * BW(),
                height: 12 * BW(),
                marginLeft: 4 * BW(),
                transform: [{rotate: isArabic() ? '180deg' : '0deg'}],
              }}
              h5
              styleIcon={{tintColor: '#000'}}
              icon={require('../../../assets/icons/Arrow-Icon.png')}
              onPress={() =>
                NavigationService.navigate('WebViewScreen', {
                  url: `${getBaseURL() + data?.data?.main_data?.url}`,
                })
              }
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {!!data?.data?.images_data &&
              data?.data?.images_data?.map((sub, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: 130 * BW(),
                    height: '100%',
                    marginLeft: index == 0 ? 40 * BW() : 10 * BW(),
                    borderRadius: 10 * BW(),
                    overflow: 'hidden',
                  }}
                  onPress={() =>
                    NavigationService.navigate('WebViewScreen', {
                      url: `${getBaseURL() + sub?.url}`,
                    })
                  }>
                  <CustomImage
                    url={getBaseURL() + sub?.image}
                    resizeMode={'contain'}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                      position: 'absolute',
                    }}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
export default CategAndItsChilds;

const getStyle = (colors: any) => {
  return StyleSheet.create({
    mainCategory: {
      height: 200 * BW(),
      width: Dimensions.get('screen').width,
      borderRadius: 0 * BW(),
      overflow: 'hidden',
      position: 'relative',
    },
    mainImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: 'absolute',
    },
    categoryContent: {
      flexDirection: 'row',
      paddingLeft: 15 * BW(),
      paddingVertical: 15 * BW(),
      height: '100%',
    },
    btn: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      height: 'auto',
      padding: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
      marginTop: 30 * BW(),
      width: 90 * BW(),
    },
  });
};
