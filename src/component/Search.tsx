import {Alert, Dimensions, Image, NativeModules, Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
 
import {BH, BW} from '../style/theme';
import {useTheme} from '@react-navigation/native';
import Input from './Input';
import Button from './Button';
import NavigationService from '../naigation/NavigationService';
import {useTranslation} from 'react-i18next';
import shop from '../redux/reducers/shop/slice/shop';
import {setOffset} from '../redux/reducers/shop/slice/shop';
import {RootState, useAppDispatch, useAppSelector} from '../redux/store';
import {getShop} from '../redux/reducers/shop/thunk/shop';
import {isArabic} from '../locales';
import {useEffect, useState} from 'react';
// import Voice from '@react-native-voice/voice';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {PermissionsAndroid, Platform} from 'react-native';
 
// async function requestMicrophonePermission() {
//   if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//       {
//         title: 'Microphone Permission',
//         message: 'هذا التطبيق يحتاج استخدام الميكروفون لتحويل الكلام إلى نص',
//         buttonNeutral: 'سؤال لاحقاً',
//         buttonNegative: 'إلغاء',
//         buttonPositive: 'موافق',
//       },
//     );
//     console.log('Microphone permission result:', granted);
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   }
//   return true;    
// }
 
const Search = ({
  searchValue,
  setSearchValue,
  search,
  setSearch,
  onSearch,
  onClose,
  style,
  inputStyle,
  viewStyle,
  onPressSearchBtn,
  autoFocus = false,
}: any) => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
 
  //---- Voice search ----
 
//   const [recognizedText, setRecognizedText] = useState('');
//   const [isListening, setIsListening] = useState(false);
 
//   useEffect(() => {
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechError = onSpeechError;
 
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);
 
// const onSpeechResults = (e) => {
//   console.log('📝 Speech results received:', e.value);
//   if (e.value && e.value.length > 0) {
//     setRecognizedText(e.value[0]);
//     console.log('✅ Recognized text set:', e.value[0]);
//   }
// };
 
// const onSpeechError = (e) => {
//   console.error('⚠️ Speech recognition error:', e);
// };
 
// const startListening = async () => {
//   console.log('⏯️ Start Listening requested');
//   setRecognizedText('');
 
//   try {
//     // تأكد من منح الإذن
//     const hasPermission = await requestMicrophonePermission();
//     if (!hasPermission) {
//       Alert.alert('خطأ', 'لم يتم منح إذن الميكروفون');
//       return;
//     }
 
//     console.log('🌐 Starting Voice recognition with language: en-US');
//     await Voice.start('en-US'); // أو حسب اللغة
//     setIsListening(true);
//     console.log('🎙️ Voice listening started');
//   } catch (e) {
//     console.error('❌ Error starting listening:', e);
//   }
// };
 
// const stopListening = async () => {
//   console.log('⏹️ Stop Listening requested');
//   try {
//     await Voice.stop();
//     await Voice.cancel(); // تفصل الجلسة الحالية
//     setIsListening(false);
//     console.log('🛑 Voice listening stopped');
//   } catch (e) {
//     console.error('❌ Error stopping listening:', e);
//   }
// };
 
 
  return (
    <Animatable.View
      style={[styles.searchContainer, {...style}]}
      onTouchEnd={() =>
        onSearch ? {} : NavigationService.navigate('SearchScreen')
      }>
      
      <Input
        textInput
        value={searchValue}
        styleInput={{
          marginTop: 0,
          borderWidth: 0,
          borderRadius: 0,
          borderLeftWidth: 0,
          ...inputStyle,
        }}
        viewStyle={{
          marginTop: 0,
          flex: 1,
          ...viewStyle,
        }}
        onChangeText={setSearchValue}
        placeholder={t('searchph')}
        disabled={onSearch ? false : true}
        autoFocus={autoFocus}
      />
    </Animatable.View>
  );
};
 
const getStyles = (colors: any) =>
  StyleSheet.create({
    searchContainer: {
      padding: 1 * BW(),
      paddingHorizontal: 8 * BW(),
      backgroundColor: colors.background,
      borderRadius: 12 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16 * BW(),
      height: 36 * BW(),
    },
 
    btn: {
      width: 'auto',
      height: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      borderRadius: 0,
      // backgroundColor:"black",
      // zIndex:1000
    },
  });
 
export default Search;
 