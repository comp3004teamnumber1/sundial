import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import { getSessionKey, setStorageKey } from './src/components/constants';
import MainStack from './src/MainStack';
import LoginScreen from './src/LoginScreen';
import LoadingComponent from './src/components/loadingComponent';

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
    // check if logged in
    const res = await getSessionKey();
    if (res === null) {
      console.log('No session key found.');
      return;
    }
    this.setState({ isReady: true });
  }

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
    const { isReady, loggedIn } = this.state;
    if (!isReady) {
      return <LoadingComponent />;
    }

    return (
      <NavigationContainer>
        {loggedIn && <MainStack />}
        {!loggedIn && <LoginScreen login={this.handleLogin} />}
      </NavigationContainer>
    );
  }
}
