import { setLoaderStatus } from '../reducers/loader';
import { store } from '../store';
import { production, local, staging } from '../../../app.json';
import { isArabic } from '../../locales';
import { setServerStatus } from '../reducers/server';
import reactotron from 'reactotron-react-native';

// let URL = 'http://192.168.0.208:8888';
let URL = 'https://seen.ae';

if (production) {
  URL = 'https://seen.infostrategic.com';
}
const fallbackURL = production
  ? 'https://seen.ae'
  : 'https://mod-seen.infostrategic.com';

if (local) {
  URL = 'http://localhost.local:8016';
}
if (staging) {
  URL = 'https://seen-stg.ripplez.ae';
  // URL = 'https://seen-deploy.infostrategic.com/';
}

const getBaseURL = () => (isArabic() ? `${URL}/ar` : `${URL}/en`);
let BaseURL = isArabic() ? `https://seen.ae/ar` : `https://seen.ae/en`;

const request = async (
  method: string,
  endpoint: string,
  data?: object,
  hasRetried = false,
) => {
  store.dispatch(setLoaderStatus(true));

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: 'Basic ZGVtbzpkZW1v',
    // lang: (await reduxStorage.getItem('lang')) || 'ar',
    lang: isArabic() ? 'ar_001' : 'en_US',
    token: store.getState().auth.token || '',
  };

  // const currentURL = hasRetried ? fallbackURL : URL;
  const currentURL = staging
    ? 'https://seen-stg.ripplez.ae'
    : hasRetried
      ? fallbackURL
      : URL;
  const url = `${currentURL}${endpoint}`;

  try {
    return await fetchWithTimeout(url, {
      method,
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: data,
      }),
    })
      .then(res => {
        return res;
      })
      .then(async (response: any) => {
        store.dispatch(setLoaderStatus(false));
        if (response?.status == 200) {
          return await response
            .json()
            .then((res: any) => {
              return { networkSuccess: true, ...res };
            })
            .catch(e => {
              reactotron.log('endpoint from retry', endpoint);
              if (!hasRetried) {
                URL = fallbackURL;
                BaseURL = isArabic() ? `${URL}/ar` : `${URL}/en`;
                return request(method, endpoint, data, true);
              }
              if (hasRetried) {
                store.dispatch(setServerStatus(false));
              }
              return { networkSuccess: false };
            });
        } else {
          if (!hasRetried) {
            URL = fallbackURL;
            BaseURL = isArabic() ? `${URL}/ar` : `${URL}/en`;
            return request(method, endpoint, data, true);
          }
          if (hasRetried) {
            store.dispatch(setServerStatus(false));
          }
          // store.dispatch(setServerStatus(false));
          return { networkSuccess: true, status: response?.status };
        }
      })
      .catch(e => {
        // store.dispatch(setServerStatus(false));
        if (!hasRetried) {
          URL = fallbackURL;
          BaseURL = isArabic() ? `${URL}/ar` : `${URL}/en`;
          return request(method, endpoint, data, true);
        }
        if (hasRetried) {
          store.dispatch(setServerStatus(false));
        }
        return { networkSuccess: false };
      });
  } catch (e) {
    if (!hasRetried) {
      URL = fallbackURL;
      BaseURL = isArabic() ? `${URL}/ar` : `${URL}/en`;
      return request(method, endpoint, data, true);
    }
    if (hasRetried) {
      store.dispatch(setServerStatus(false));
    }
    // store.dispatch(setServerStatus(false));
    return { networkSuccess: false };
  }
};

export async function fetchWithTimeout(
  url: string,
  options: {},
  timeout = 50000000,
) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(JSON.stringify({ networkSuccess: false })),
        timeout,
      ),
    ),
  ]);
}

export const buildBody = (data: object): string => {
  const queryString = Object.entries(data)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return queryString;
};
export { request, URL, getBaseURL, BaseURL };
