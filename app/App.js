import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import {
  getSessionKey,
  getStorageKey,
  setStorageKey,
} from './src/util/Storage';
import MainStack from './src/MainStack';
import LoginScreen from './src/LoginScreen';
import Loading from './src/components/Loading';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      loggedIn: false,
      username: '',
    };
  }

  async componentDidMount() {
    // load fonts
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Feather.font,
    });

    // Default metric units
    if (!(await getStorageKey('units'))) {
      setStorageKey('units', 'metric');
    }

    // use these lines to clear keys (for testing)
    // await setStorageKey('session_key', '');
    // await setStorageKey('username', '');
    // await setStorageKey('saved_locations', '');

    // check if logged in
    let res = await getSessionKey();
    if (res === null) {
      console.log('No session key found. Searching for username...');
      res = await getStorageKey('username');
      if (res === null) {
        console.log('No username found.');
        this.setState({ isReady: true });
      } else {
        console.log('Username found.');
        this.setState({ isReady: true, username: res });
      }
    } else {
      this.setState({ isReady: true, loggedIn: true });
    }
  }

  logOut = () => {
    setStorageKey('session_key', '');
    this.setState({ loggedIn: false });
  };

  handleLogin = async (username, session_key) => {
    const res1 = await setStorageKey('username', username);
    const res2 = await setStorageKey('session_key', session_key);
    if (!res1 || !res2) {
      console.log('Error setting login credentials');
      return;
    }
    this.setState({ loggedIn: true });
  };

  render() {
    const { isReady, loggedIn, username } = this.state;
    if (!isReady) {
      return <Loading />;
    }

    return (
      <NavigationContainer>
        {loggedIn && <MainStack logout={this.logOut} />}
        {!loggedIn && (
          <LoginScreen login={this.handleLogin} username={username} />
        )}
      </NavigationContainer>
    );
  }
}
