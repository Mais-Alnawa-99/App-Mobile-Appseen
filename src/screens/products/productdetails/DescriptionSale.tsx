import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { isArabic } from '../../../locales';
import Text from '../../../component/Text';
import { BH, BW } from '../../../style/theme';
import RenderHtmlComponent from '../../../component/renderHtml/RenderHtml';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import FlatListComp from '../../../component/FlatList';
import CustomImage from '../../../component/CustomImage';
import moment from 'moment';
function Description(props: any): JSX.Element {
  const { data } = props;
  const { colors } = useTheme();
  const styles = getStyle(colors);
  const { t } = useTranslation();
  const productDescription = isArabic()
    ? data.description_ar
    : data.description_en;

  // الحالة لإدارة الفتح والإغلاق لكل قسم
  const [expanded, setExpanded] = useState({
    deliveryInfo: false,
    description: false,
    specification: false,
    benefits: false,
  });

  // دالة لتبديل حالة كل قسم عند الضغط
  const toggleExpand = (section: keyof typeof expanded) => {
    setExpanded(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const tabs = [
    ...(data?.durations_list &&
    Array.isArray(data?.durations_list) &&
    data?.durations_list.length > 0
      ? [{ id: 0, key: 'deliveryInfo', title: t('dileveryInfo') }]
      : []),
    ...(!!productDescription
      ? [{ id: 1, key: 'description', title: t('Description') }]
      : []),
    ...(data?.product_specifications?.length > 0
      ? [{ id: 2, key: 'specification', title: t('Specification') }]
      : []),
    ...(data?.product_benefits?.length > 0
      ? [{ id: 3, key: 'benefits', title: t('benefits') }]
      : []),
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => toggleExpand(item.key as keyof typeof expanded)}
        style={styles.tabsContainer}
      >
        <Text h3 bold>
          {item.title}
        </Text>
        <Image
          source={
            expanded[item.key as keyof typeof expanded]
              ? require('../../../assets/icons/up.png')
              : require('../../../assets/icons/down.png')
          }
          style={{
            width: 12 * BW(),
            height: 12 * BW(),
            resizeMode: 'contain',
            tintColor: colors.textGray,
          }}
        />
      </TouchableOpacity>
      {expanded.deliveryInfo && item.key === 'deliveryInfo' && (
        <View
          style={{
            paddingHorizontal: 16 * BW(),
          }}
        >
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
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 4 * BW(),
                    alignItems: 'center',
                  }}
                >
                  {duration?.thick_icon ? (
                    <CustomImage
                      url={`${URL}${duration?.thick_icon}`}
                      resizeMode={'contain'}
                      style={{ width: 15 * BW(), height: 15 * BW() }}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/loginBg/group.png')}
                      style={{ width: 15 * BW(), height: 15 * BW() }}
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
                    }}
                  >
                    {duration?.values?.name}
                  </Text>
                </View>
                {duration?.values?.duration?.same ? (
                  <>
                    {!duration?.values?.duration?.static && (
                      <Text h4 style={{ marginLeft: 6 * BW() }}>
                        {formattedendDate}
                      </Text>
                    )}
                  </>
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <Text h4 bold style={{ marginLeft: 6 * BW() }}>
                      {duration?.values?.duration?.display_text}
                    </Text>
                    {!duration?.values?.duration?.static && (
                      <>
                        <Text h4 style={{ marginLeft: 6 * BW() }}>
                          {formattedstartDate} ,
                        </Text>
                        <Text h4 style={{ marginLeft: 6 * BW() }}>
                          {formattedendDate}
                        </Text>
                      </>
                    )}
                  </View>
                )}
                <Text h4 style={{ marginLeft: 6 * BW() }}>
                  {duration?.values?.duration?.order_cutoff_remaining_time}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      {expanded.description && item.key === 'description' && (
        <View style={styles.collapsedContent}>
          <RenderHtmlComponent
            description={productDescription}
            noAutoWidth={true}
          />
        </View>
      )}

      {expanded.specification && item.key === 'specification' && (
        <View style={styles.specificationContainer}>
          {data?.product_specifications?.map((specification, index) => (
            <View key={index} style={styles.specificationItem}>
              <Text h4 style={{ width: 100 * BW() }}>
                {specification?.key}
              </Text>
              <Text h4>{specification?.value}</Text>
            </View>
          ))}
        </View>
      )}

      {expanded.benefits && item.key === 'benefits' && (
        <View style={styles.benefitsContainer}>
          {data?.product_benefits?.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text h4 style={{ marginBottom: 4 * BW() }}>
                {'• '}
                {benefit}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <>
      <FlatListComp data={tabs} renderItem={renderItem} />
      <View style={{ paddingHorizontal: 10 * BW() }}>
        <Text h2 bold>
          {t('shopSafelyAndSustainably')}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Image
            source={
              isArabic()
                ? require('../../../assets/icons/pd_ar_1.png')
                : require('../../../assets/icons/pd_1.png')
            }
            style={styles.pd_img}
          />
          <Image
            source={
              isArabic()
                ? require('../../../assets/icons/pd_ar_2.png')
                : require('../../../assets/icons/pd_2.png')
            }
            style={styles.pd_img}
          />
          <Image
            source={
              isArabic()
                ? require('../../../assets/icons/pd_ar_3.png')
                : require('../../../assets/icons/pd_3.png')
            }
            style={styles.pd_img}
          />
          <Image
            source={
              isArabic()
                ? require('../../../assets/icons/pd_ar_4.png')
                : require('../../../assets/icons/pd_4.png')
            }
            style={styles.pd_img}
          />
        </View>
      </View>
    </>
  );
}

export default Description;

const getStyle = (colors: any) =>
  StyleSheet.create({
    accordionContainer: {
      borderTopColor: '#E7E7E7',
      borderTopWidth: 1 * BW(),
      marginBottom: 8 * BW(),
    },
    tabsContainer: {
      height: 'auto',
      minWidth: 65 * BW(),
      marginVertical: 8 * BW(),
      paddingHorizontal: 16 * BW(),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    collapsedContent: {
      // maxHeight: 130 * BH(),
      // height: 'auto', // اجعل المحتوى ينزلق عند الفتح
      // overflow: 'hidden',
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 40 * BW(),
    },
    nextIcon: {
      width: 12 * BW(),
      height: 12 * BH(),
      resizeMode: 'contain',
      tintColor: colors.backgroundDark,
      transform: [{ rotate: isArabic() ? '180deg' : '0deg' }],
    },
    readMoreButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4 * BW(),
    },
    specificationContainer: {
      paddingVertical: 6 * BW(),
      paddingHorizontal: 16 * BW(),
    },
    specificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1 * BW(),
      borderBottomColor: '#E7E7E7',
      paddingVertical: 6 * BW(),
      justifyContent: 'space-between',
    },
    benefitsContainer: {
      paddingVertical: 6 * BW(),
      paddingHorizontal: 10 * BW(),
    },
    benefitItem: {
      paddingVertical: 6 * BW(),
      paddingHorizontal: 10 * BW(),
    },
    pd_img: {
      width: 82 * BW(),
      height: 100 * BW(),
      resizeMode: 'contain',
    },
  });
