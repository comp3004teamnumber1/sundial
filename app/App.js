import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './src/HomeScreen';
import CalendarScreen from './src/CalendarScreen';
import WeatherScreen from './src/WeatherScreen';
import AccountScreen from './src/AccountScreen';

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Feather.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName='Home'
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
          <Tab.Screen name='Calendar' component={CalendarScreen} />
          <Tab.Screen name='Weather' component={WeatherScreen} />
          <Tab.Screen name='Account' component={AccountScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
