import React from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
import Text from '../../../component/Text';
import {BW} from '../../../style/theme';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import NavigationService from '../../../naigation/NavigationService';
import {getBaseURL, URL} from '../../../redux/network/api';
import CustomImage from '../../../component/CustomImage';
import {isArabic} from '../../../locales';
import moment from 'moment';
function ProductSeller(props: any): JSX.Element {
  const {data} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const sellerMarketplaceUrl = data?.seller_marketplace_url;
  const sellerMarketplaceImg = data?.marketplace_seller_image;
  const fullUrl = `${getBaseURL()}${sellerMarketplaceUrl}`;
  const imageFullPath = `${getBaseURL()}${sellerMarketplaceImg}`;
  return (
    <View
      style={{
        borderTopColor: '#E7E7E7',
        borderTopWidth: 1 * BW(),
      }}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          NavigationService.navigate('SellerProfile', {
            sellerId: data?.seller_id,
          });
          // NavigationService.navigate('WebViewScreen', {url: fullUrl});
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10 * BW(),
          }}>
          <View style={styles.sellerImage}>
            <CustomImage
              url={imageFullPath}
              resizeMode={'contain'}
              style={{width: '100%', height: '100%', borderRadius: 20 * BW()}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 210 * BW(),
              gap: 5 * BW(),
            }}>
            <Text h3>{t('visit')}</Text>
            <Text h3 numberOfLines={1} style={{color: colors.golden}}>
              {data?.marketplace_seller_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              // NavigationService.navigate('SellerProfile', {
              //   sellerId: data?.seller_id,
              // })
              NavigationService.navigate('WebViewScreen', {url: fullUrl})
            }>
            <Image
              source={require('../../../assets/icons/Arrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {/* {data?.durations_list &&
        Array.isArray(data?.durations_list) &&
        data?.durations_list?.length > 0 && (
          <View
            style={{
              padding: 16 * BW(),
              borderTopColor: '#E7E7E7',
              borderTopWidth: 1 * BW(),
            }}>
            <Text h3 bold>
              {t('dileveryInfo')} :
            </Text>
            {data?.durations_list.map((duration, indx) => {
              const startDate = duration?.values?.duration?.start;
              const endDate = duration?.values?.duration?.end;

              const formattedstartDate = moment(startDate, 'MM/DD/YYYY').format(
                'MMM DD, YYYY',
              );
              const formattedendDate = moment(endDate, 'MM/DD/YYYY').format(
                'MMM DD, YYYY',
              );
              return (
                <View
                  key={indx}
                  style={{
                    backgroundColor: duration?.color
                      ? duration?.color
                      : '#6160dc1a',
                    borderRadius: 10 * BW(),
                    paddingHorizontal: 10 * BW(),
                    paddingVertical: 8 * BW(),
                    marginVertical: 6 * BW(),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 4 * BW(),
                      alignItems: 'center',
                    }}>
                    {duration?.thick_icon ? (
                      <CustomImage
                        url={`${URL}${duration?.thick_icon}`}
                        resizeMode={'contain'}
                        style={{width: 15 * BW(), height: 15 * BW()}}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/loginBg/group.png')}
                        style={{width: 15 * BW(), height: 15 * BW()}}
                        resizeMode={'contain'}
                      />
                    )}
                    <Text
                      h4
                      bold
                      style={{
                        color: duration?.color_name
                          ? duration?.color_name
                          : '#6160DC',
                      }}>
                      {duration?.values?.name}
                    </Text>
                  </View>
                  {duration?.values?.duration?.same ? (
                    <>
                      {!duration?.values?.duration?.static && (
                        <Text h4 style={{marginLeft: 6 * BW()}}>
                          {formattedendDate}
                        </Text>
                      )}
                    </>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text h4 bold style={{marginLeft: 6 * BW()}}>
                        {duration?.values?.duration?.display_text}
                      </Text>
                      {!duration?.values?.duration?.static && (
                        <>
                          <Text h4 style={{marginLeft: 6 * BW()}}>
                            {formattedstartDate} ,
                          </Text>
                          <Text h4 style={{marginLeft: 6 * BW()}}>
                            {formattedendDate}
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                  <Text h4 style={{marginLeft: 6 * BW()}}>
                    {duration?.values?.duration?.order_cutoff_remaining_time}
                  </Text>
                </View>
              );
            })}
          </View>
        )} */}
      {!!data?.seller_delivery_message && (
        <View style={{paddingHorizontal: 16 * BW()}}>
          <Text h3 style={{color: '#cba84b'}}>
            {data?.seller_delivery_message}
          </Text>
        </View>
      )}
    </View>
  );
}
export default ProductSeller;

const getStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 16 * BW(),
      paddingRight: 0 * BW(),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sellerImage: {
      width: 80 * BW(),
      height: 80 * BW(),
      borderWidth: 1,
      borderColor: colors.gray + 'cc',
      borderRadius: 20 * BW(),
    },
    arrowIcon: {
      width: 40 * BW(),
      height: 30 * BW(),
      resizeMode: 'contain',
      tintColor: colors.textGray,
      transform: [{rotate: isArabic() ? '180deg' : '0deg'}],
    },
  });
