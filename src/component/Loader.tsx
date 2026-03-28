import React from 'react';
import Video from 'react-native-video';
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import theme, {BW} from '../style/theme';
import Error from './error/Error';
import {useAppSelector} from '../redux/store';

type PropsType = {
  isLoading?: boolean;
  children?: JSX.Element;
  style?: object;
  showImage?: boolean;
  isLandscape?: boolean;
  size?: number;
  color?: string;
  modal?: boolean;
  inline?: boolean;
};

export default function Loader({
  isLoading,
  children,
  style,
  showImage,
  isLandscape,
  size,
  color,
  modal = false,
  inline = false,
}: PropsType): JSX.Element {
  const styles = getStyles();
  const {isOnline} = useAppSelector(store => store.server);
  if (!isOnline) {
    return <Error error_connection={true} />;
  }
  if (!isLoading) {
    return <>{children}</>;
  }
  return (
    <>
      {modal ? (
        <Modal visible={isLoading} transparent={true} animationType="fade">
          <TouchableOpacity style={styles.overlay} activeOpacity={1}>
            <View style={[styles.modalContainer, style]}>
              <ActivityIndicator
                size={size ? size : 30}
                color={color ? color : theme?.themeObject.colors.primaryColor}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      ) : showImage ? (
        <Video
          source={require('../assets/homeBg/Comp-1.mp4')}
          resizeMode="stretch"
          volume={1}
          style={{width: '100%', height: '100%'}}
          onEnd={() => {}}
        />
      ) : (
        <SafeAreaView
          style={[
            inline
              ? {justifyContent: 'center', alignItems: 'center'}
              : styles.activity,
            style,
          ]}>
          <ActivityIndicator
            size={size ? size : 30}
            color={color ? color : theme?.themeObject.colors.primaryColor}
          />
        </SafeAreaView>
      )}
    </>
  );
}

const getStyles = () =>
  StyleSheet.create({
    activity: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      padding: 20 * BW(),
      backgroundColor: '#fff',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
