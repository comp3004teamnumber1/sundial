import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import CalendarStack from './CalendarStack';
import WeatherStack from './WeatherStack';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator();

export default function MainStack() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      lazy='false'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Home') {
            icon = 'home';
          } else if (route.name === 'Calendar') {
            icon = 'calendar';
          } else if (route.name === 'Weather') {
            icon = 'sun';
          } else if (route.name === 'Account') {
            icon = 'user';
          } else {
            icon = 'help-circle';
          }
          return <Feather name={icon} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#ffffff',
        inactiveTintColor: '#ffffff',
        activeBackgroundColor: '#000000',
        inactiveBackgroundColor: '#000000',
        showLabel: false,
      }}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Calendar' component={CalendarStack} />
      <Tab.Screen name='Weather' component={WeatherStack} />
      <Tab.Screen name='Account' component={AccountStack} />
    </Tab.Navigator>
  );
}
