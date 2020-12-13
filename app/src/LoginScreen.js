import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  Container,
  Text,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import query from './util/SundialAPI';
import { setStorageKey, getSettings } from './util/Storage';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 24,
    marginBottom: 24,
  },
  container: {
    backgroundColor: '#231F29',
  },
  containerForm: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    marginTop: 24,
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#000000',
  },
  textError: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 24,
  },
  buttonLogin: {
    marginLeft: 16,
    marginVertical: 8,
    backgroundColor: '#ff8c42',
  },
  buttonRegister: {
    marginLeft: 16,
    marginVertical: 8,
    backgroundColor: '#332e3c',
  },
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username || '',
      password: '',
      alertUsername: false,
      alertPassword: false,
      errorMsg: '',
    };
  }

  checkInputs = () => {
    const { username, password } = this.state;
    let verified = true;
    // check username
    if (!username) {
      this.setState({ alertUsername: true });
      verified = false;
    } else {
      this.setState({ alertUsername: false });
    }
    // check password
    if (!password) {
      this.setState({ alertPassword: true });
      verified = false;
    } else {
      this.setState({ alertPassword: false });
    }
    return verified;
  };

  handleLogin = async () => {
    if (!this.checkInputs()) {
      this.setState({ errorMsg: 'Please check your username/password.' });
      return;
    }
    const { username, password } = this.state;
    const { login } = this.props;
    // query
    const res = await query('login', 'post', { username, password });
    // check response
    if (res === null) {
      this.setState({
        errorMsg: 'An error occurred. Please try again.',
      });
      console.log('Error occured while logging in.');
    } else if (res.status !== 200) {
      this.setState({
        errorMsg: 'Incorrect username/password. Please try again.',
      });
    } else {
      let { session_key, settings } = res;
      login(username, session_key);

      try {

        settings = JSON.parse(settings);
      }
      catch (e) {
        settings = {};
      }
      finally {
        settings.home_screen_display = settings.home_screen_display || 'Weekly Weather';
        settings.units = settings.units || 'Metric';
        settings.time = settings.time || '12 Hour Format';
        settings.saved_locations = settings.saved_locations || '';

        await setStorageKey('settings', JSON.stringify(settings));
      }
    }
  };

  handleRegister = async () => {
    if (!this.checkInputs()) {
      this.setState({ errorMsg: 'Please check your username/password.' });
      return;
    }
    const { username, password } = this.state;
    const res = await query('register', 'post', { username, password });
    // check response
    if (res === null) {
      this.setState({
        errorMsg: 'An error occurred. Please try again.',
      });
      console.log('Error occured while registering.');
    } else {
      this.handleLogin();
    }
  };

  render() {
    const { username, alertUsername, alertPassword, errorMsg } = this.state;

    return (
      <Container style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.title}>Login</Text>

          <Form style={styles.containerForm}>
            <Item error={alertUsername}>
              <Label style={styles.textLight}>
                <Feather name='user' size={24} color='white' />
              </Label>
              <Input
                style={styles.textLight}
                placeholder='Username'
                defaultValue={username}
                onChangeText={val => {
                  this.setState({ username: val });
                }}
              />
            </Item>
            <Item error={alertPassword}>
              <Label style={styles.textLight}>
                <Feather name='lock' size={24} color='white' />
              </Label>
              <Input
                style={styles.textLight}
                secureTextEntry
                placeholder='••••••••'
                onChangeText={val => {
                  this.setState({ password: val });
                }}
              />
            </Item>
            <Text style={styles.textError}>{errorMsg}</Text>
          </Form>
          <Button block style={styles.buttonLogin} onPress={this.handleLogin}>
            <Text style={styles.textDark}>Sign In</Text>
          </Button>
          <Button
            block
            style={styles.buttonRegister}
            onPress={this.handleRegister}
          >
            <Text style={styles.textLight}>Register</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
