import {useDispatch, useSelector} from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Reactotron from '../../ReactotronConfig';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  Storage,
  persistReducer,
  persistStore,
} from 'redux-persist';
import reducer from './reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = AsyncStorage;

export const reduxStorage: Storage = {
  setItem: (key: any, value: any) => {
    storage.setItem(key, JSON.stringify(value));
    return Promise.resolve(true);
  },
  getItem: async (key: any) => {
    let value = await storage.getItem(key);
    if (value) {
      return Promise.resolve(JSON.parse(value));
    } else {
      return Promise.resolve(value);
    }
  },
  removeItem: (key: any) => {
    storage.removeItem(key);
    return Promise.resolve();
  },
};
const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['auth', 'lang', 'intro', 'session'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    enhancers: (getDefaultEnhancers) => {
    if (__DEV__) {
      return getDefaultEnhancers().concat(Reactotron.createEnhancer());
    }
    return getDefaultEnhancers();
  },
  devTools: __DEV__,
});
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
