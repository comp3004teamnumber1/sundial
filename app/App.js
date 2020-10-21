import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import MainStack from './src/MainStack';
import LoginScreen from './src/LoginScreen';

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      loggedIn: false,
    };
  }

  async componentDidMount() {
    // load fonts
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Feather.font,
    });

    // use this line to clear the key (for testing)
    // await AsyncStorage.setItem('session_key', '');

    // check if logged in
    try {
      let key = await AsyncStorage.getItem('session_key');
      if (key) {
        this.setState({ loggedIn: true });
      }
    } catch (e) {
      console.log('No session key found. Rerouting to Login screen...');
    }
    this.setState({ isReady: true });
  }

  handleLogin = async key => {
    try {
      // Set our key
      await AsyncStorage.setItem('session_key', key);
      this.setState({ loggedIn: true });
    } catch (e) {
      console.error('Error setting session key.');
    }
  };

  render() {
    const { isReady, loggedIn } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }

    return (
      <NavigationContainer>
        {loggedIn && <MainStack />}
        {!loggedIn && <LoginScreen loginFn={this.handleLogin} />}
      </NavigationContainer>
    );
  }
}
