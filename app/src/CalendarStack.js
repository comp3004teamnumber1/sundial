import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import CalendarHome from './Calendar/CalendarHome';
import AddEvent from './Calendar/AddEvent';

const Stack = createStackNavigator();

export default function CalendarStack() {
  return (
    <Stack.Navigator
      initialRouteName='CalendarHome'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <Stack.Screen name='CalendarHome' component={CalendarHome} />
      <Stack.Screen name='AddEvent' component={AddEvent} />
    </Stack.Navigator>
  );
}
