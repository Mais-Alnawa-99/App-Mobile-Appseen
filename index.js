/**
 * @format
 */
if (__DEV__) {
  require('./ReactotronConfig');
}
import 'react-native-get-random-values';
import './src/locales/  index';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
