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
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import { getStorageKey } from '../util/Storage';
import query from '../util/SundialAPI';

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
  textDateTime: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 4,
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
});

export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    let date;
    if (props.route.params.date) {
      const [year, month, day] = props.route.params.date.split('-');
      date = moment()
        .set({ year, month: month - 1, date: day })
        .toDate();
    } else {
      date = new Date();
    }
    this.state = {
      task: '',
      date,
      mode: 'date',
      pickerOpen: false,
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

  showMode = newMode => {
    this.setState({ pickerOpen: true, mode: newMode });
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
    console.log(moment(date).format('YYYY-MM-DD h:mm a'));
    const data = {
      task,
      date: moment(date).format('X'),
      ideal_weather,
      location,
    };
    const res = await query('task', 'post', data);
    if (res === null) {
      this.setState({ errorMsg: 'An error occurred. Please try again.' });
      return;
    }

    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { date, ideal_weather, errorMsg, mode, pickerOpen } = this.state;

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
            <Item
              onPress={() => {
                this.showMode('date');
              }}
            >
              <Label style={styles.textLight}>
                <Feather name='calendar' size={24} color='white' />
              </Label>
              <Text style={styles.textDateTime}>
                {moment(date).format('YYYY-MM-DD')}
              </Text>
            </Item>
            <Item
              onPress={() => {
                this.showMode('time');
              }}
            >
              <Label style={styles.textLight}>
                <Feather name='clock' size={24} color='white' />
              </Label>
              <Text style={styles.textDateTime}>
                {moment(date).format('h:mm a')}
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
              <Text style={styles.textDark}>Add Event</Text>
            </Button>
          </Container>
        </Container>
        {pickerOpen ? (
          <DateTimePicker
            value={date}
            mode={mode}
            display='default'
            onChange={this.handleDateChange}
          />
        ) : null}
      </Container>
    );
  }
}
