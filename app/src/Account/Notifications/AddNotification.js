import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Container,
  Text,
  Form,
  Item,
  Input,
  Label,
  Button,
  Picker,
  CheckBox,
  Right,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import { getStorageKey } from '../../util/Storage';
import query from '../../util/SundialAPI';

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
  textInput: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 12,
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
  checkBox: {
    marginRight: 20,
  },
});

export default class AddNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      ideal_weather: 'Clear',
      location: '',
      errorMsg: '',
      pickerOpen: false,
    };
  }

  async componentDidMount() {
    const current_location = await getStorageKey('current_location');
    if (!current_location) {
      return;
    }
    this.setState({ location: current_location });
  }

  handleDateChange = (event, newDate) => {
    const { date } = this.state;
    const currDate = newDate || date;
    if (Platform.OS === 'android') {
      this.setState({ pickerOpen: false });
    }
    this.setDate(currDate);
  };

  setDate = newDate => {
    this.setState({ date: newDate });
  };

  setWeather = newWeather => {
    this.setState({ ideal_weather: newWeather });
  };

  validateInputs = () => {
    const { date, ideal_weather, location } = this.state;
    return date && ideal_weather && location;
  };

  handleSubmit = async () => {
    if (!this.validateInputs()) {
      this.setState({ errorMsg: 'Please fill in all fields.' });
      return;
    }
    const { date, ideal_weather, location, tracking } = this.state;
    const momentDate = moment(date);
    const offset = momentDate.utcOffset();
    const data = {
      date: momentDate.format('X'),
      ideal_weather,
      location,
      offset,
    };
    const res = await query('notification/day', 'post', data);
    if (res === null) {
      this.setState({ errorMsg: 'An error occurred. Please try again.' });
      return;
    }
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { date, ideal_weather, errorMsg, pickerOpen, location } = this.state;

    return (
      <Container style={styles.container}>
        <Header />
        <Container style={styles.content}>
          <Text style={styles.title}>Add a Notification</Text>
          <Form style={styles.containerForm}>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='map-pin' size={24} color='white' />
              </Label>
              <Input
                style={styles.textLight}
                placeholder={location}
                placeholderTextColor='#aaaaaa'
                onChangeText={val => {
                  this.setState({ location: val });
                }}
              />
            </Item>
            <Item
              onPress={() => {
                this.setState({ pickerOpen: true });
              }}
            >
              <Label style={styles.textLight}>
                <Feather name='calendar' size={24} color='white' />
              </Label>
              <Text style={styles.textInput}>
                {moment(date).format('YYYY-MM-DD')}
              </Text>
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
            {errorMsg ? <Text style={styles.textError}>{errorMsg}</Text> : null}
          </Form>
          <Container style={styles.footer}>
            <Button block style={styles.btn} onPress={this.handleSubmit}>
              <Text style={styles.textDark}>Add Notification</Text>
            </Button>
          </Container>
        </Container>
        {pickerOpen ? (
          <DateTimePicker
            value={date}
            mode='date'
            display='default'
            onChange={this.handleDateChange}
          />
        ) : null}
      </Container>
    );
  }
}
