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
  DatePicker,
  Picker,
} from 'native-base';
import axios from 'axios';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import {
  constants,
  getSessionKey,
  getStorageKey,
} from '../components/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
  },
  containerForm: {
    backgroundColor: '#231F29',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#231F29',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
    marginRight: 16,
  },
  footer: {
    backgroundColor: '#231F29',
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    marginBottom: 12,
  },
  textLight: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 4,
  },
  textDark: {
    color: '#000000',
  },
  textDate: {
    color: '#ffffff',
    fontSize: 16,
  },
  textError: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 24,
  },
  btn: {
    marginLeft: 16,
    marginTop: 16,
    backgroundColor: '#ff8c42',
  },
});

export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      date: moment().format('YYYY-MM-DD'),
      ideal_weather: 'Clear',
      location: 'Ottawa, Ontario',
      errorMsg: '',
    };
  }

  async componentDidMount() {
    const current_location = await getStorageKey('current_location');
    if (!current_location) {
      return;
    }
    this.setState({ location: current_location });
  }

  setDate = newDate => {
    this.setState({ date: moment(newDate).format('YYYY-MM-DD') });
  };

  setWeather = newWeather => {
    this.setState({ ideal_weather: newWeather });
  };

  validateInputs = () => {
    const { task, date, ideal_weather, location } = this.state;
    return task && date && ideal_weather && location;
  };

  handleSubmit = async () => {
    if (!this.validateInputs()) {
      this.setState({ errorMsg: 'Please fill in all fields.' });
      return;
    }
    const { task, date, ideal_weather, location } = this.state;
    const session_key = await getSessionKey();
    const config = {
      headers: {
        'Session-Key': session_key,
      },
    };
    const data = {
      task,
      date: moment(date).unix(),
      ideal_weather,
      location,
    };
    const res = await axios.post(`${constants.SERVER_URL}/task`, data, config);
    if (res.status !== 200) {
      this.setState({ errorMsg: 'An error occurred. Please try again.' });
      return;
    }
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { date, ideal_weather, errorMsg } = this.state;

    return (
      <Container style={styles.container}>
        <Header />
        <Container style={styles.content}>
          <Text style={styles.title}>Add an Event</Text>
          <Form style={styles.containerForm}>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='message-circle' size={24} color='white' />
              </Label>
              <Input
                style={styles.textLight}
                placeholder='Event'
                placeholderTextColor='#aaaaaa'
                onChangeText={val => {
                  this.setState({ task: val });
                }}
              />
            </Item>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='clock' size={24} color='white' />
              </Label>
              <DatePicker
                defaultDate={moment(date).toDate()}
                locale='en'
                formatChosenDate={d => moment(d).format('YYYY-MM-DD')}
                onDateChange={this.setDate}
                textStyle={styles.textDate}
              />
            </Item>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='cloud' size={24} color='white' />
              </Label>
              <Picker
                mode='dropdown'
                style={{ color: '#ffffff' }}
                selectedValue={ideal_weather}
                onValueChange={this.setWeather}
              >
                <Picker.Item label='Clear' value='Clear' />
                <Picker.Item label='Clouds' value='Clouds' />
                <Picker.Item label='Rain' value='Rain' />
                <Picker.Item label='Drizzle' value='Drizzle' />
                <Picker.Item label='Snow' value='Snow' />
                <Picker.Item label='Thunderstorm' value='Thunderstorm' />
              </Picker>
            </Item>
            {errorMsg ? (
              <Text style={styles.textError}>{errorMsg}</Text>
            ) : undefined}
          </Form>
          <Container style={styles.footer}>
            <Button block style={styles.btn} onPress={this.handleSubmit}>
              <Text style={styles.textDark}>Add Event</Text>
            </Button>
          </Container>
        </Container>
      </Container>
    );
  }
}
