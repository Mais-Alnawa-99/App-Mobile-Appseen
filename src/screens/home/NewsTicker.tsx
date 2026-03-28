import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { Marquee } from '@animatereactnative/marquee';
import { isArabic } from '../../locales';
import Text from '../../component/Text';

const NewsTicker = ({ news }) => {
  const latestNews = news.latest_news?.join('   •   ') + '   •   ' || '';
  const bgColor = news.bg_color || '#c0433a';
  const textColor = news.text_color || '#fff';
  const [repeatedNews, setRepeatedNews] = useState('');

  useEffect(() => {
    if (latestNews) {
      const repeated = `${latestNews}     ${latestNews}`;
      setRepeatedNews(repeated);
    }
  }, [latestNews]);

  if (!repeatedNews) return null;

  return (
    <View style={{ paddingTop: StatusBar.currentHeight }}>
      <View
        style={{
          width: '100%',
          height: 32,
          backgroundColor: bgColor,
          justifyContent: 'center',
        }}
      >
        <Marquee
          style={{
            color: textColor,
            fontWeight: 'bold',
            textAlignVertical: 'center',
          }}
          spacing={0}
          speed={0.7}
          reverse={isArabic()}
        >
          <Text h4 bold style={{ color: textColor }}>
            {repeatedNews}
          </Text>
        </Marquee>
      </View>
    </View>
  );
};

export default NewsTicker;
