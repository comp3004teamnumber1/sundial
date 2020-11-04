import React, { Component } from 'react';
import { StatusBar, StyleSheet, LogBox } from 'react-native';
import { Container, Text, Content, DatePicker } from 'native-base';
import axios from 'axios';
import moment from 'moment';
// Components
import { constants, getSessionKey } from '../components/constants';
import CalendarMonthView from './CalendarMonthView';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginHorizontal: 24,
    marginTop: 24,
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#231F29',
    alignContent: 'space-between',
    paddingTop: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 24,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
  },
});

export default class CalendarHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      tasks: null,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs([
      'DatePickerIOS has been merged with DatePickerAndroid and will be removed in a future release.',
      'DatePickerAndroid has been merged with DatePickerIOS and will be removed in a future release.',
    ]);

    // get relevant info for request
    const session_key = await getSessionKey();
    const config = {
      headers: {
        'Session-Key': session_key,
      },
    };

    // query data
    let taskRes;
    try {
      taskRes = await axios.get(`${constants.SERVER_URL}/task`, config);
    } catch (e) {
      console.log('An error occurred while fetching task data.');
      console.error(e);
      return;
    }

    // set our state
    this.setState({
      tasks: taskRes.data.tasks,
    });
  }

  setDate = newDate => {
    this.setState({ date: moment(newDate).format('YYYY-MM-DD') });
  };

  render() {
    const { date, tasks } = this.state;

    return (
      <Container style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.title}>Calendar</Text>
          <DatePicker
            ref={this.datePicker}
            defaultDate={moment(date).toDate()}
            locale='en'
            formatChosenDate={d => moment(d).format('MMMM')}
            animationType='slide'
            onDateChange={this.setDate}
            textStyle={styles.subtitle}
          />
          <CalendarMonthView date={date} setDate={this.setDate} />
        </Content>
      </Container>
    );
  }
}
