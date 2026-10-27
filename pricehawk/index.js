/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Keep compatibility with the previously installed Android build, which asks
// React Native to launch the component under this name.
AppRegistry.registerComponent('final_project', () => App);
