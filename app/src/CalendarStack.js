import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import CalendarHome from './Calendar/CalendarHome';
import AddEvent from './Calendar/AddEvent';
import Search from './Calendar/Search';
import Suggested from './Calendar/Suggested';

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
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='Suggested' component={Suggested} />
    </Stack.Navigator>
  );
}
