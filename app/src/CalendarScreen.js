import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import CalendarHome from './CalendarScreen/CalendarHome';
import AddEvent from './CalendarScreen/AddEvent';

const CalendarStack = createStackNavigator();

export default function CalendarScreen() {
  return (
    <CalendarStack.Navigator
      initialRouteName='CalendarHome'
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <CalendarStack.Screen name='CalendarHome' component={CalendarHome} />
      <CalendarStack.Screen name='AddEvent' component={AddEvent} />
    </CalendarStack.Navigator>
  );
}
