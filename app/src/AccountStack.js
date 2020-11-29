import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Settings from './Account/Settings';
import SettingsAccount from './Account/SettingsAccount';
import SettingsHelp from './Account/SettingsHelp';
import SettingsNotifications from './Account/SettingsNotifications';

const Stack = createStackNavigator();

export default function AccountStack({ logout }) {
  return (
    <Stack.Navigator
      initialRouteName='Settings'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name='Settings' >
        {props => <Settings {...props} logout={logout} />}
      </Stack.Screen>
      <Stack.Screen name='SettingsAccount' component={SettingsAccount} />
      <Stack.Screen name='SettingsHelp' component={SettingsHelp} />
      <Stack.Screen
        name='SettingsNotifications'
        component={SettingsNotifications}
      />
    </Stack.Navigator>
  );
}
