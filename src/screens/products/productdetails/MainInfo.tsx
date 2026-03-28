import React from 'react';
import Text from '../../../component/Text';
import {useTheme} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BH, BW} from '../../../style/theme';
import {isArabic} from '../../../locales';
import {useTranslation} from 'react-i18next';
import Counter from './Counter';
import {Image} from 'react-native-elements';
import {getGeneralStyle} from '../../../style/styles';

function MainInfo(props: any): JSX.Element {
  const {
    data,
    count,
    increaseCount,
    price,
    decreaseCount,
    discountpercentage,
    reducePrice,
    basePrice,
  } = props;

  const {colors} = useTheme();
  const styles = getStyle(colors);
  const generalStyles = getGeneralStyle(colors);
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, gap: 10 * BW()}}>
      <View style={[styles.flexRow, {paddingTop: 10 * BW()}]}>
        <View style={[styles.flexRow, styles.priceContainer]}>
          {/* Show currency symbol (Dirham image) on left or right depending on language */}
          {!isArabic() && data['currency_symbol '] === 'ᴁ' && (
            <Image
              source={require('../../../assets/icons/dirham.png')}
              style={[
                generalStyles.currencyImage,
                !!basePrice &&
                !!reducePrice &&
                parseFloat(basePrice) > parseFloat(reducePrice)
                  ? { tintColor: colors.red } 
                  : {},
                  {  
                    width: 14 * BW(),
                    height: 14 * BW(),
                    resizeMode: 'contain',
                  }
              ]}
            />
          )}

          {!!basePrice &&
          !!reducePrice &&
          parseFloat(basePrice) > parseFloat(reducePrice) ? (
            <View
              style={{
                flexDirection: isArabic() ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 4 * BW(),
              }}>
              <Text h2 bold style={styles.priceReduce}>
                {reducePrice}
              </Text>
              <Text h3 bold style={styles.basePrice}>
                {basePrice}
              </Text>
              {discountpercentage > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {`${discountpercentage}% ${t('Discount')}`}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text h1 bold>
              {price}
            </Text>
          )}

          {isArabic() && data['currency_symbol '] === 'ᴁ' && (
            <Image
              source={require('../../../assets/icons/dirham.png')}
              style={[
                generalStyles.currencyImage,
                !!basePrice &&
                !!reducePrice &&
                parseFloat(basePrice) > parseFloat(reducePrice)
                  ? { tintColor: colors.red } 
                  : {},
                  {
                    width: 14 * BW(),
                    height: 14 * BW(),
                    resizeMode: 'contain',
                  }
              ]}
            />
          )}
        </View>
      </View>

      <Text h3 bold>
        {isArabic() ? data?.name_ar : data?.name_en}{' '}
        {data.description_sale_en ? '-' : ''}{' '}
        {isArabic() ? data.description_sale_ar : data.description_sale_en}
      </Text>

      {!!data?.brand_name && (
        <Text h3 bold style={{color: '#9F9F9F'}}>
          {t('brand')} : {data?.brand_name}
        </Text>
      )}
    </View>
  );
}

export default MainInfo;

const getStyle = (colors: any) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceContainer: {
      gap: 2 * BW(),
    },
    cartCount: {
      width: 86 * BW(),
      padding: 2 * BW(),
    },
    square: {
      height: 48 * BH(),
      borderRadius: 10 * BW(),
      borderColor: colors.gray + 'cc',
      borderWidth: 1 * BW(),
    },
    cardCountNum: {
      justifyContent: 'center',
      width: 25 * BW(),
    },
    basePrice: {
      textDecorationLine: 'line-through',
      color: colors.gray,
      marginRight: 5 * BW(),
    },
    priceReduce: {
      color: colors.red,
    },
    discountBadge: {
      paddingVertical: 2 * BH(),
      paddingHorizontal: 10 * BW(),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5 * BW(),
      right: 10 * BW(),
    },
    discountText: {
      color: '#008200',
      fontSize: 16,
      textAlign: 'center',
    },
  });
