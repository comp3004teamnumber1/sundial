import React, { Component } from 'react';
import { StatusBar, StyleSheet, LogBox } from 'react-native';
import {
  Container,
  Text,
  Content,
  DatePicker,
  Card,
  CardItem,
  Fab,
  Button,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import moment from 'moment';
// Components
import { constants, queryCalendar, dummy } from '../components/constants';
import CalendarMonthView from './CalendarMonthView';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#231F29',
    padding: 24,
  },
  cards: {
    flexGrow: 1,
  },
  cardContainer: {
    borderColor: '#231F29',
    backgroundColor: '#231F29',
  },
  cardHeader: {
    backgroundColor: '#332E3C',
    borderColor: '#231F29',
    borderBottomWidth: 1,
  },
  cardItem: {
    backgroundColor: '#332E3C',
    borderColor: '#231F29',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    textAlign: 'center',
  },
  subtitleDate: {
    color: '#ffffff',
    fontSize: 24,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 24,
    padding: 8,
  },
  textHeader: {
    color: '#6699CC',
    fontSize: 16,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default class CalendarHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format('YYYY-MM-DD'),
      tasks: dummy.taskPayload,
      fabOpen: false,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs([
      'DatePickerIOS has been merged with DatePickerAndroid and will be removed in a future release.',
      'DatePickerAndroid has been merged with DatePickerIOS and will be removed in a future release.',
    ]);

    await this.updateTasks();
  }

  setDate = async newDate => {
    this.setState({ date: moment(newDate).format('YYYY-MM-DD') });
    await this.updateTasks();
  };

  // eslint-disable-next-line react/destructuring-assignment
  updateTasks = async (date = this.state.date) => {
    let res;
    try {
      res = await queryCalendar(date);
    } catch (e) {
      console.log('An error occurred while querying the server');
      console.error(e);
      return;
    }

    if (res instanceof Error) {
      console.log('An error occurred while querying the Calendar');
      return;
    }

    this.setState({ tasks: res });
  };

  render() {
    const { date, tasks, fabOpen } = this.state;
    const { navigation } = this.props;

    const renderTasks = () => {
      let arr = [];
      for (let task of tasks) {
        arr.push(
          <Card style={styles.cardContainer} key={`${task.id}`}>
            <CardItem style={styles.cardHeader} header bordered>
              <Text style={styles.textHeader}>
                {moment(task.date).format('h:mm a')}
              </Text>
            </CardItem>
            <CardItem style={styles.cardItem} bordered>
              <Text style={styles.text}>{task.task}</Text>
            </CardItem>
          </Card>
        );
      }
      return arr;
    };

    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text style={styles.title}>Calendar</Text>
          <DatePicker
            defaultDate={moment(date).toDate()}
            locale='en'
            formatChosenDate={d => moment(d).format('MMMM')}
            animationType='slide'
            onDateChange={this.setDate}
            textStyle={styles.subtitle}
          />
          <CalendarMonthView date={date} setDate={this.setDate} />
          <Text style={styles.subtitle}>{moment(date).format('dddd')}</Text>
          {tasks.length > 0 ? (
            renderTasks()
          ) : (
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardItem} bordered>
                <Text style={styles.text}>No tasks found!</Text>
              </CardItem>
            </Card>
          )}
        </Content>
        <Fab
          active={fabOpen}
          direction='up'
          position='bottomRight'
          style={{ backgroundColor: '#FF8C42' }}
          onPress={() => this.setState({ fabOpen: !fabOpen })}
        >
          <Feather name='edit-3' size={24} color='white' />
          <Button
            style={{ backgroundColor: '#6699CC' }}
            onPress={() => {
              navigation.navigate('AddEvent');
            }}
          >
            <Feather name='plus' size={24} color='white' />
          </Button>
        </Fab>
      </Container>
    );
  }
}
