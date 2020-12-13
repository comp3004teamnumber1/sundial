import React, { Component } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import WeatherScreen from './Weather/WeatherScreen';
import WeatherNavigation from './Weather/WeatherNavigation';
import AddWeatherLocation from './Weather/AddWeatherLocation';
import { getStorageKey } from './util/Storage';

const Stack = createStackNavigator();

export default class WeatherStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
    };
  }

  async componentDidMount() {
    this.setState({
      location: await getStorageKey('current_location'),
    });
  }

  render() {
    const { location } = this.state;

    return (
      <Stack.Navigator
        initialRouteName={location ? 'WeatherScreen' : 'WeatherNavigation'}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name='WeatherScreen' component={WeatherScreen} />
        <Stack.Screen name='WeatherNavigation' component={WeatherNavigation} />
        <Stack.Screen
          name='AddWeatherLocation'
          component={AddWeatherLocation}
        />
      </Stack.Navigator>
    );
  }
}
