import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform, Share } from 'react-native';
import { store } from './redux/store';
import { isArabic } from './locales';
import { setToken } from './redux/reducers/Notification/slice/tokenNotification';
import NavigationService from './naigation/NavigationService';
import { getBaseURL } from './redux/network/api';

export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'seen_notification_channel',
    name: 'SEEN',
    importance: AndroidImportance.HIGH,
  });
};

export const LocalNotification = async (notification: {
  title?: string;
  message?: string;
}) => {
  if (!notification) return;

  const { title, message } = notification;

  await notifee.displayNotification({
    title,
    body: message,
    android: {
      channelId: 'seen_notification_channel',
      smallIcon: 'ic_launcher',
      vibrationPattern: [300, 500],
    },
    ios: {
      sound: 'default',
    },
  });
};

/**
 * Get FCM token and store in Redux
 */
export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    store.dispatch(setToken({ token: fcmToken }));
  }
  return fcmToken || null;
};

/**
 * Subscribe to topics based on language
 */
export const subscribeTopics = async () => {
  const topic = isArabic() ? 'users-ar' : 'users-en';
  await messaging().subscribeToTopic(topic);
};

/**
 * Unsubscribe from topics
 */
export const unSubscribeTopics = async () => {
  await messaging().unsubscribeFromTopic('users-ar');
  await messaging().unsubscribeFromTopic('users-en');
  await messaging().subscribeToTopic('all');
};

/**
 * Request notification permission (Android 13+)
 */
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (error) {
      console.warn('Notification permission denied', error);
    }
  }
};

/**
 * Handle foreground messages
 */
export const handleForegroundNotifications = () => {
  messaging().onMessage(async remoteMessage => {
    await LocalNotification({
      title: remoteMessage?.notification?.title,
      message: remoteMessage?.notification?.body,
    });

    if (remoteMessage?.data?.type === 'stock') {
      setTimeout(() => {
        NavigationService.navigate('WebViewScreen', {
          url: `${getBaseURL()}/my/orders/${remoteMessage?.data?.record?.toString()}`,
        });
      }, 1000);
    }
  });
};

/**
 * Handle background / quit state notifications
 */
export const handleBackgroundNotifications = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await LocalNotification({
      title: remoteMessage?.notification?.title,
      message: remoteMessage?.notification?.body,
    });
  });
};

/**
 * Share FCM token
 */
export const onShareToken = async () => {
  const token = await getFcmToken();
  if (!token) return;

  try {
    const result = await Share.share({ message: token });
    if (result.action === Share.sharedAction) {
      // shared successfully
    }
  } catch (error) {
    console.warn('Share error', error);
  }
};

/**
 * Initialize notification service
 * Call this on app startup
 */
export const initNotificationService = async () => {
  await createNotificationChannel();
  await requestNotificationPermission();
  await getFcmToken();
  await subscribeTopics();
  handleForegroundNotifications();
  handleBackgroundNotifications();
};
