import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import CalendarHome from './CalendarScreen/CalendarHome';

const CalendarStack = createStackNavigator();

export default function CalendarScreen() {
  return (
    <CalendarStack.Navigator
      initialRouteName='CalendarHome'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      }}
    >
      <CalendarStack.Screen name='CalendarHome' component={CalendarHome} />
    </CalendarStack.Navigator>
  );
}
