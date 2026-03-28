import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import Text from '../../../component/Text';
import {BW} from '../../../style/theme';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {getBaseURL} from '../../../redux/network/api';
import SectionTitle from './SectionTitle';
import CustomImage from '../../../component/CustomImage';

function Bloggers(props: any): JSX.Element {
  const {data} = props;
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  // let data = {
  //   title: 'Bloggers',
  //   display_title: true,
  //   type: 'bloggers_slider',
  //   data: {
  //     blogger_data: [
  //       {
  //         id: 5,
  //         title: 'sara mohammad',
  //         blogger_name: 'sara mohammad',
  //         sequence: 10,
  //         page_item_id: [42, 'Bloggers'],
  //         background: require('../../../assets/media/blogger1.png'),
  //       },
  //       {
  //         id: 6,
  //         title: false,
  //         blogger_name: 'Reema',
  //         sequence: 10,
  //         page_item_id: [42, 'Bloggers'],
  //         background: require('../../../assets/media/blogger3.png'),
  //       },
  //       {
  //         id: 7,
  //         title: false,
  //         blogger_name: 'Rzma',
  //         sequence: 10,
  //         page_item_id: [42, 'Bloggers'],
  //         background: require('../../../assets/media/blogger2.png'),
  //       },
  //       {
  //         id: 8,
  //         title: false,
  //         blogger_name: 'Ahood',
  //         sequence: 10,
  //         page_item_id: [42, 'Bloggers'],
  //         background: require('../../../assets/media/blogger4.png'),
  //       },
  //     ],
  //   },
  //   id: 42,
  //   items_counts: {},
  //   link_title: false,
  //   display_quick_link: false,
  //   link: '',
  // };
  return (
    <View
      style={{
        paddingLeft: 16 * BW(),
        paddingBottom: 16 * BW(),
      }}>
      {data?.display_title ? <SectionTitle data={data} /> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          height: 200 * BW(),
          width: Dimensions.get('screen').width - 20 * BW(),
          borderRadius: 0 * BW(),
          overflow: 'hidden',
          position: 'relative',
        }}>
        {!!data?.data?.blogger_data &&
          data?.data?.blogger_data?.map((blogger, index) => (
            <View key={index} style={{alignItems: 'center', gap: 4 * BW()}}>
              <View
                key={index}
                style={{
                  width: 140 * BW(),
                  height: 170 * BW(),
                  marginLeft: index == 0 ? 0 : 10 * BW(),
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomImage
                  url={getBaseURL() + blogger?.background}
                  resizeMode={'contain'}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    // position: 'absolute',
                  }}
                />
              </View>
              <Text h3>{blogger?.blogger_name}</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

export default Bloggers;

const getStyle = (colors: any) => {
  return StyleSheet.create({});
};
