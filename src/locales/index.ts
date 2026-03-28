import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './langauges/en.json';
import ar from './langauges/ar.json';
import {reduxStorage, store} from '../redux/store';

export default i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {translation: en},
    ar: {translation: ar},
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const isArabic = () => {
  let lang = store.getState().lang?.lang || 'ar';
  if (lang === 'ar') {
    return true;
  } else {
    return false;
  }
};
