import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';

import theme, {BH, BW} from '../style/theme';
import Button from './Button';
import Text from './Text';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function AddAttachment({
  attachment,
  setAttachment,
  style,
  showLabel,
  backgroundColor,
  required,
  maxFileSize,
  acceptedFiles,
}: any) {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();
  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  const picker = async () => {
    try {
      let typeFiles = {
        '.png': DocumentPicker.types.images,
        '.jpg': DocumentPicker.types.images,
        '.docx': DocumentPicker.types.docx,
        '.pdf': DocumentPicker.types.pdf,
        '*': DocumentPicker.types.allFiles,
      };
      let types: any = [];
      for (const fileType of acceptedFiles) {
        if (`${fileType}` in typeFiles) {
          types.push(typeFiles[`${fileType}`]);
        }
      }
      if (Platform.OS !== 'ios') {
        const allow = await requestCameraPermission();
      }
      const res = await DocumentPicker.pickSingle({
        type: types,
      });
      let files: any = [];
      if (Platform.OS == 'android') {
        RNFetchBlob.fs.readFile(res.uri, 'base64').then(data => {
          files.push(...attachment, {
            id: Math.random(),
            // file: data,
            attach: res.uri,
            type: res.type, // mime type
            name: res.name,
            size: res.size,
          });
          setAttachment(files);
        });
      } else {
        RNFetchBlob.config({
          fileCache: true,
        })
          .fetch('GET', res.uri)
          // the image is now dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile('base64');
          })
          .then(base64Data => {
            files.push(...attachment, {
              id: Math.random(),
              // file: base64Data,
              attach: res.uri,
              type: res.type, // mime type
              name: res.name,
              size: res.size,
            });
            setAttachment(files);
          });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const deleteFile = file => {
    let files = attachment;
    let attach = files.filter(item => item.id !== file.id);
    setAttachment(attach);
  };
  const _openFile = file => {
    FileViewer.open(file.attach);
  };

  return (
    <View style={style}>
      <Text h4 style={{color: colors.textColor + 'aa'}}>
        {t('files')}
      </Text>

      {attachment.map((item: any, index: number): any => (
        <Animatable.View
          duration={1000}
          delay={150}
          animation={index % 2 != 0 ? 'fadeInLeft' : 'fadeInRight'}
          key={index}
          style={[
            styles.row,
            {
              paddingHorizontal: 10 * BW(),
              backgroundColor: colors.primary + '11',
            },
          ]}>
          <View style={{flex: 3, flexDirection: 'row'}}>
            <Text h4 style={{flex: 1}} numberOfLines={1}>
              {item.name}
            </Text>
            <Text h4>{Math.ceil(item?.size / 1000)} KB</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              marginLeft: 10 * BW(),
            }}>
            {item?.attach != 'base64' && (
              <Button
                style={styles.icon}
                styleIcon={styles.styleIconEye}
                containerIcon={styles.containerIcon}
                onPress={() => _openFile(item)}
                icon={require('../assets/icons/eye.png')}
              />
            )}
            <View
              style={{
                height: 18 * BH(),
                width: 1 * BW(),
                backgroundColor: '#B6B6B6',
                marginHorizontal: 10 * BW(),
              }}
            />
            <Button
              style={styles.icon}
              styleIcon={styles.styleIconDelete}
              onPress={() => deleteFile(item)}
              containerIcon={styles.containerIcon}
              icon={require('../assets/icons/delete.png')}
            />
          </View>
        </Animatable.View>
      ))}
      <Button
        title={t('addFile')}
        onPress={() => picker()}
        style={{
          backgroundColor: backgroundColor
            ? backgroundColor
            : colors.background,
          height: 'auto',
          padding: 8 * BW(),
          borderRadius: 8 * BW(),
          borderColor: required ? 'red' : '#cccccc88',
          borderWidth: required ? 0.5 * BW() : 0.3 * BW(),
        }}
      />
      {maxFileSize && (
        <>
          <Text style={styles.maxFileSizeText}>
            {t('allowedExtension')} {acceptedFiles}
          </Text>

          <Text style={styles.maxFileSizeText}>
            {t('maximumSize')} {maxFileSize / 1000000} MB
          </Text>
        </>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: colors.primaryColor,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopEndRadius: 20 * BW(),
      borderTopStartRadius: 20 * BW(),
      paddingHorizontal: 20 * BW(),
      padding: 10 * BW(),
    },
    typeVacationContainer: {
      backgroundColor: '#fff',
      borderRadius: 10 * BW(),
      paddingHorizontal: 4 * BW(),
      paddingTop: 8 * BW(),
      position: 'absolute',
      alignSelf: 'center',
      top: 0,
      zIndex: 999,
    },
    text: {
      color: '#535353',
    },
    row: {
      flexDirection: 'row',
      paddingHorizontal: 8 * BW(),
      marginVertical: 5 * BW(),
      alignItems: 'center',
      paddingVertical: 8 * BW(),
      borderRadius: 8 * BW(),
    },
    image: {
      width: 15 * BW(),
      height: 15 * BW(),
      tintColor: '#CDCDCD',
    },

    button: {
      marginTop: 10 * BW(),
      backgroundColor: theme.themeObject.colors.primaryColor,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: 150 * BW(),
    },
    optionsContainer: {
      borderBottomLeftRadius: 8 * BW(),
      borderBottomRightRadius: 8 * BW(),
      paddingTop: 8 * BW(),
      paddingHorizontal: 5 * BW(),
      borderTopColor: '#CDCDCD',
      borderTopWidth: 1,
    },
    box: {
      backgroundColor: '#F5F6FA',
      minHeight: 70 * BW(),
      width: '100%',
      zIndex: 999,
      marginLeft: 0,
    },
    icon: {
      width: 'auto',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      flex: 1,
      borderRadius: 0,
    },
    styleIconEye: {
      tintColor: 'green',
      width: 16 * BW(),
      height: 16 * BW(),
    },
    styleIconDelete: {
      tintColor: colors.primary,
      width: 16 * BW(),
      height: 16 * BW(),
    },
    containerIcon: {
      width: 'auto',
      height: 'auto',
    },
    maxFileSizeText: {
      color: colors.primaryColor,
      fontSize: 9 * BW(),
      lineHeight: 15 * BW(),
    },
  });
