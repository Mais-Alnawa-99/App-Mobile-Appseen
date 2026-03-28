import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Share,
  ShareContent,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
//import base64 from 'react-native-base64';

import Geocoder from 'react-native-geocoding';
import reactotron from '../redux/reactotron';
import {URL} from '../redux/network/api';
import {isArabic} from '../locales';
import {mapKey} from '../../app.json';
import {PublicKey} from '../screens/auth/key';
import {RSA} from 'react-native-rsa-native';

export function replaceArabicNumerals(input: string): string {
  return input.replace(/[٠-٩]/g, match =>
    '٠١٢٣٤٥٦٧٨٩'.indexOf(match).toString(),
  );
}

export const getTextFromHtml = (htmlString: any) => {
  if (!!htmlString) {
    const regex = /(<([^>]+)>)/gi;
    const result = htmlString.replace(regex, '');
    const r = result.replace('\n', '');
    const final = r.replace('&nbsp;', '');
    return final;
  }
};

export const getImage = (files: any[]) => {
  let language = 'ar';
  const image = files?.find(
    file =>
      file &&
      file?.mimetype?.split('/')[0] === 'image' &&
      check_language_publishmode(file?.publishMode),
  );
  return {
    uuid: image?.uuid,
    alt: image?.alt ? image?.alt[language] || '' : null,
  };
};
export const getFiles = (files: any[]) => {
  if (!files?.length) return;
  let filteredFiles = files?.filter(
    file =>
      file &&
      check_language_publishmode(file?.publishMode) &&
      file?.mimetype?.includes('application'),
  );
  return filteredFiles;
};

export const getImageArray = (files: any[]) => {
  if (!files?.length) return;
  let images = files?.filter(
    file =>
      file &&
      check_language_publishmode(file?.publishMode) &&
      file?.mimetype?.includes('image'),
  );

  return images;
};

export const check_language_publishmode = (publicMode: number) => {
  let outcomes = false;
  let language = isArabic() ? 'ar' : 'en';
  if (
    language === 'ar' &&
    (publicMode === 1 ||
      publicMode === 2 ||
      publicMode === 3 ||
      publicMode === 7)
  ) {
    outcomes = true;
  } else if (
    language === 'en' &&
    (publicMode === 4 ||
      publicMode === 2 ||
      publicMode === 5 ||
      publicMode === 7)
  ) {
    outcomes = true;
  } else if (
    language === 'fr' &&
    (publicMode === 6 ||
      publicMode === 3 ||
      publicMode === 5 ||
      publicMode === 7)
  ) {
    outcomes = true;
  }
  return outcomes;
};

export function removeDuplicatesByKey<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}
export const showImage = (img: any) => {
  return URL + '/api/file/download/' + getImage(img)?.uuid;
};

export const getParamsFromUrl = (url: string) => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }

  return params;
};
export const IMAGE_URL = (uuid: string) => `${URL}/api/file/download/${uuid}`;
export const File_URL = (uuid: string) => `${URL}/api/file/download/${uuid}`;

export const openWhatsappChat = phone => {
  let url = 'whatsapp://send?phone=0097127774747';
  let webUrl = 'https://wa.me/' + phone;
  Linking.openURL(webUrl);
};

export const openDirectWhatsappChat = () => {
  let url = 'whatsapp://send?phone=0097127774747';
  let webUrl = 'https://wa.me/97127774747';
  Linking.openURL(webUrl);
};

export const openSmsChat = sms => {
  Linking.openURL('sms:' + sms);
};

export const callPhoneNumber = phoneNumber => {
  const phoneUrl = `tel:${phoneNumber}`;
  Linking.openURL(phoneUrl);
};

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      // request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      // });
      return true;
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    return false;
  }
};

export const detectLocation = async () => {
  const granted = await requestLocationPermission();
  if (granted) {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        error => {
          resolve({faild: true, error});
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }
};

export const requestLocation = ({latitude, longitude}: any) => {
  Geocoder.init(mapKey);
  return new Promise((resolve, reject) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        var addressComponent = json.results[0];
        resolve(addressComponent);
      })
      .catch(error => resolve({status: false, error}));
  });
};

// export const encodeToBase64 = (str: string) => {
//   return base64.encode(str);
// };

export const encodedMessage = (message: string) => {
  return new Promise((resolve, reject) => {
    RSA.encrypt(message, PublicKey)
      .then(encodedMessage => {
        resolve({encodedMessage});
      })
      .catch(error => resolve({encodedMessage: message}));
  });
};

export const onShare = async (item: ShareContent) => {
  try {
    const result = await Share.share(item);
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
