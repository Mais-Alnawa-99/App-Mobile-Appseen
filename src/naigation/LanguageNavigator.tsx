import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useColorScheme} from 'react-native';
import Lang from '../screens/Lang';

type RootStackParamList = {
  Lang: any;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();

const LanguageNavigator = () => {
  const scheme = useColorScheme();

  return (
    <RootStack.Navigator initialRouteName="Lang">
      <RootStack.Screen
        name="Lang"
        component={Lang}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
};

export default LanguageNavigator;
