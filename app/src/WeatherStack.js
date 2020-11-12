import React, { Component } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import WeatherScreen from './WeatherStack/WeatherScreen';
import WeatherNavigation from './WeatherStack/WeatherNavigation';
import AddWeatherLocation from './WeatherStack/AddWeatherLocation';
import { getStorageKey } from './components/constants';

const weatherStack = createStackNavigator();

export default class WeatherStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: ''
    }
  }
  async componentDidMount() {
    this.setState({
      location: await getStorageKey('current_location')
    });
  }
  render() {
    return (
      <weatherStack.Navigator
        initialRouteName={this.location ? 'WeatherView' : 'WeatherNavigation'}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <weatherStack.Screen name='WeatherView' component={WeatherScreen} />
        <weatherStack.Screen name='WeatherNavigation' component={WeatherNavigation} />
        <weatherStack.Screen name='AddWeatherLocation' component={AddWeatherLocation} />
      </weatherStack.Navigator>
    );
  }
}
