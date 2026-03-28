import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Text from '../../../component/Text';
import {BW, BH} from '../../../style/theme';
import {useTheme} from '@react-navigation/native';
import Button from '../../../component/Button';
import {isArabic} from '../../../locales';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import {withDecay} from 'react-native-reanimated';

interface ProductData {
  title: string;
  display_title: boolean;
  // type: string;
  // data: any;
  display_quick_link: boolean;
  icon_title: string;
  link_title: string;
  link: string;
}
interface sectionTitleProps {
  data: ProductData;
  onPress: any;
}
function SectionTitle(props: sectionTitleProps): JSX.Element | null {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {data} = props;

  return (
    <View style={styles.productSectionTitle}>
      <View style={{flexDirection: 'row'}}>
        {data?.icon_title && (
          <CustomImage
            url={getBaseURL() + data?.icon_title}
            style={{width: 30 * BW(), height: 30 * BW()}}
          />
        )}

        <Text h1 bold>
          {data?.title}
        </Text>
      </View>

      {data?.display_quick_link ? (
        <Button
          style={styles.btn}
          title={data.link_title}
          styleText={{color: '#303030'}}
          containerIcon={{
            width: 12 * BW(),
            height: 12 * BW(),
            marginLeft: 10 * BW(),
            transform: [{rotate: isArabic() ? '180deg' : '0deg'}],
          }}
          styleIcon={{tintColor: '#303030'}}
          h4
          icon={require('../../../assets/icons/Arrow-Icon.png')}
          onPress={props.onPress ? props.onPress : () => {}}
        />
      ) : null}
    </View>
  );
}
const getStyle = (colors: any) =>
  StyleSheet.create({
    productSectionTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: 16 * BW(),
      marginBottom: 6 * BW(),
    },
    btn: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      height: 'auto',
      width: 'auto',
      padding: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
    },
  });
export default SectionTitle;
