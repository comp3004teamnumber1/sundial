import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Settings from './Account/Settings';
import SettingsAccount from './Account/SettingsAccount';
import SettingsCalendar from './Account/SettingsCalendar';
import SettingsHelp from './Account/SettingsHelp';
import SettingsWeather from './Account/SettingsWeather';
import SettingsNotifications from './Account/SettingsNotifications';

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator
      initialRouteName='Settings'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='SettingsAccount' component={SettingsAccount} />
      <Stack.Screen name='SettingsCalendar' component={SettingsCalendar} />
      <Stack.Screen name='SettingsHelp' component={SettingsHelp} />
      <Stack.Screen
        name='SettingsNotifications'
        component={SettingsNotifications}
      />
      <Stack.Screen name='SettingsWeather' component={SettingsWeather} />
    </Stack.Navigator>
  );
}
