// ReactotronConfig.ts

import Reactotron, {
  Reactotron as ReactotronCore,
} from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Only configure Reactotron in development mode
const reactotron = Reactotron.configure({
  name: 'marketplaceseenapp',
  // optionally override host, e.g. host: '192.168.x.x'
})
  .setAsyncStorageHandler(AsyncStorage) // so Reactotron can monitor AsyncStorage
  .useReactNative({
    asyncStorage: true, // enable asyncStorage monitor
    networking: {
      ignoreUrls: /symbolicate/, // ignore these urls, adjust as needed
    },
    editor: false,
    errors: { veto: frame => false },
    overlay: false,
  })
  .use(reactotronRedux()) // add Redux plugin
  .connect();

// Clear Reactotron logs on every app reload/init (optional, but helpful)
reactotron.clear();

// Export the configured instance
export default reactotron;
