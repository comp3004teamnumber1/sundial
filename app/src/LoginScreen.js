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
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 24,
    marginBottom: 48,
  },
  container: {
    backgroundColor: '#231F29',
  },
  form: {
    width: '100%',
    marginTop: 16,
    marginBottom: 36,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#000000',
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
      username: '',
      password: '',
    };
  }

  handleLogin = async () => {
    const { username, password } = this.state;
    if (!username || !password) {
      return;
    }
    // hack for now
    const { loginFn } = this.props;
    loginFn('1');
    // axios
    //   .post('http://10.0.2.2:5000/login', {
    //     username,
    //     password,
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(e => {
    //     console.error(e);
    //   });
  };

  handleRegister = () => {
    const { username, password } = this.state;
    if (!username || !password) {
      return;
    }
    axios
      .post('http://10.0.2.2:5000/register', {
        username,
        password,
      })
      .then(
        res => {
          this.handleLogin();
        },
        e => {
          console.error(e);
        }
      );
  };

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.title}>Login</Text>

          <Form style={styles.form}>
            <Item>
              <Label style={styles.textLight}>
                <Feather name="user" size={24} color="white" />
              </Label>
              <Input
                style={styles.textLight}
                placeholder="Username"
                onChangeText={val => {
                  this.setState({ username: val });
                }}
              />
            </Item>
            <Item>
              <Label style={styles.textLight}>
                <Feather name="lock" size={24} color="white" />
              </Label>
              <Input
                style={styles.textLight}
                secureTextEntry
                placeholder="••••••••"
                onChangeText={val => {
                  this.setState({ password: val });
                }}
              />
            </Item>
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
