import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import NotificationBuilder from './Notifications/NotificationBuilder';
import AddNotification from './Notifications/AddNotification';

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator
      initialRouteName='NotificationBuilder'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name='NotificationBuilder'
        component={NotificationBuilder}
      />
      <Stack.Screen name='AddNotification' component={AddNotification} />
    </Stack.Navigator>
  );
}
