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
import Header from '../components/Header';
import { getSettings, getStorageKey } from '../util/Storage';
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

export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    if (props.route && props.route.params && props.route.params.date) {
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
      ideal_weather: 'Clear',
      tracking: true,
      location: 'Ottawa, Ontario',
      errorMsg: '',
      mode: 'date',
      pickerOpen: false,
      time: '',
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('focus', async () => {
      await this.getVitalData();
    });
  }

  async getVitalData() {
    const { time } = await getSettings();
    const current_location = await getStorageKey('current_location');

    if (!current_location) {
      return;
    }
    this.setState({ location: current_location, time: time });
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
    const { task, date, ideal_weather, location, tracking } = this.state;
    const momentDate = moment(date);
    const offset = momentDate.utcOffset();
    const data = {
      task,
      date: momentDate.format('X'),
      ideal_weather,
      location,
      tracking,
      offset,
    };
    const res = await query('task', 'post', data);
    if (res === null) {
      this.setState({ errorMsg: 'An error occurred. Please try again.' });
      return;
    }

    const { navigation, route } = this.props;
    navigation.navigate('CalendarHome');
    if (route && route.params && route.params.onAdd) {
      route.params.onAdd();
    }
  };

  render() {
    const {
      date,
      ideal_weather,
      errorMsg,
      mode,
      pickerOpen,
      tracking,
      time,
    } = this.state;
    return (
      <Container style={styles.container}>
        <Header />
        <Container style={styles.content}>
          <Text style={styles.title}>Add an Event</Text>
          <Form style={styles.containerForm}>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='type' size={24} color='white' />
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
              <Text style={styles.textInput}>
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
              <Text style={styles.textInput}>
                {moment().format(
                  time === '12 Hour Format' ? 'h:mm A' : 'kk:mm'
                )}
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
            <Item>
              <Label style={styles.textLight}>
                <Feather name='bell' size={24} color='white' />
              </Label>
              <Text
                style={styles.textInput}
                onPress={() => {
                  this.setState({ tracking: !tracking });
                }}
              >
                Notifications
              </Text>
              <Right>
                <CheckBox
                  style={styles.checkBox}
                  checked={tracking}
                  onPress={() => {
                    this.setState({ tracking: !tracking });
                  }}
                />
              </Right>
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
