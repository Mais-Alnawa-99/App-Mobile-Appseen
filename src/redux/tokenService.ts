import {store} from './store';
import {getSessionPublicId} from './reducers/User/thunk/login';
import { setSessionValues } from './reducers/User/session';
import reactotron from 'reactotron-react-native';

let refreshPromise: Promise<string | null> | null = null;

export const getValidToken = async (): Promise<string | null> => {
  const state = store.getState().session;
  const {sessionPublic, expiresIn} = state;

  const now = new Date();
  const exp = expiresIn ? new Date(expiresIn*1000) : new Date(0);

  const isExpired = !sessionPublic || exp <= now;
reactotron.log('getValidToken called. isExpired:', isExpired, 'sessionPublic:', sessionPublic, 'expiresIn:', expiresIn, 'now:', now, 'exp:', exp
  ,' new Date().getTime()', new Date().getTime()
);
  if (!isExpired) {
    return sessionPublic;
  }

  // if refresh already running, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  // otherwise, start refresh
  refreshPromise = (async () => {
    try {
      const result = await store.dispatch(getSessionPublicId({is_logged_in: false, session_id: sessionPublic} ));
      if (getSessionPublicId.fulfilled.match(result)) {
        store.dispatch(
                    setSessionValues({
                      session: result.payload?.result?.session,
                      expiresIn: result.payload?.result?.expires_in*1000 +  new Date().getTime(), 
                    }),
                  );
                  reactotron.log('getValidToken: obtained new sessionPublic:', result.payload?.result?.session, 'expiresIn:', result.payload?.result?.expires_in + new Date().getTime());
        return result.payload?.result?.session;
      } else {
        return null;
      }
    } finally { 
      // clear after completion so future refresh can run
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
