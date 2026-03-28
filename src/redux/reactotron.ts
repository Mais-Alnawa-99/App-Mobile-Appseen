import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import {NativeModules} from 'react-native';

const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];

const reactotron = __DEV__
  ? Reactotron.configure({name: 'SEEN', host})
      .use(reactotronRedux())
      .useReactNative()
      .connect()
  : undefined;
export default reactotron;
