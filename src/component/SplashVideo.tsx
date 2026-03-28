import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import RNBootSplash from 'react-native-bootsplash';

const { width, height } = Dimensions.get('window');

const SplashVideo = ({ onFinish }: { onFinish: () => void }) => {
  const [visible, setVisible] = useState(false);

  const handleEnd = () => {
    setVisible(false);
    onFinish?.();
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/welcome.mp4')}
        style={styles.video}
        resizeMode="cover"
        onEnd={handleEnd}
        onLoad={() => RNBootSplash.hide()}
        onError={e => {
          console.log('Video error', e);
          handleEnd();
        }}
        muted={false}
        repeat={false}
        playInBackground={false}
        playWhenInactive={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: '#FFFFFF',
  },
  video: {
    width,
    height,
  },
});

export default SplashVideo;
