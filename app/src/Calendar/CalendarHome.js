import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  RefreshControl,
  LogBox,
} from 'react-native';
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Fab,
  Button,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
// Components
import { dummy } from '../data/constants';
import { getIcon } from '../util/Util';
import query from '../util/SundialAPI';
import CalendarMonthView from './CalendarMonthView';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#231F29',
    padding: 24,
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
    marginLeft: 8,
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
      date: new Date(),
      pickerOpen: false,
      tasks: dummy.taskPayload,
      fabOpen: false,
      refreshing: false,
    };
  }

  componentDidMount() {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    this.updateTasks();
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
    this.updateTasks(newDate);
  };

  // eslint-disable-next-line react/destructuring-assignment
  updateTasks = async (date = this.state.date) => {
    const momentDate = moment(date);
    const formattedDate = momentDate.format('YYYY-MM-DD');
    const offset = momentDate.utcOffset();
    const res = await query('task', 'get', { date: formattedDate, offset });
    if (res === null) {
      Alert.alert('An error occurred', 'Please try again.');
    }
    this.setState({ tasks: res.tasks || [] });
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.updateTasks();
    this.setState({ refreshing: false });
  };

  handleDeleteTask = id => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.deleteTask(id);
        },
      },
    ]);
  };

  deleteTask = async id => {
    const res = await query(`task/${id}`, 'delete');
    if (res === null || res.status !== 200) {
      console.log('Error while deleting task');
    }
    this.handleRefresh();
  };

  render() {
    const { date, tasks, fabOpen, pickerOpen, refreshing } = this.state;
    const { navigation } = this.props;

    const renderTasks = () => {
      let arr = [];
      for (let task of tasks) {
        arr.push(
          <TouchableOpacity
            key={`${task.id}`}
            onLongPress={() => {
              this.handleDeleteTask(task.id);
            }}
          >
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardHeader} header bordered>
                {getIcon(task.ideal_weather, 24, '#ff8c42')}
                <Text style={styles.textHeader}>
                  {moment.unix(task.date).format('h:mm a')}
                </Text>
              </CardItem>
              <CardItem style={styles.cardItem} bordered>
                <Text style={styles.text}>{task.task}</Text>
              </CardItem>
            </Card>
          </TouchableOpacity>
        );
      }
      return arr;
    };

    return (
      <Container>
        <Content
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <Text style={styles.title}>Calendar</Text>
          <Text
            style={styles.subtitle}
            onPress={() => {
              this.setState({ pickerOpen: true });
            }}
          >
            {moment(date).format('MMMM')}
          </Text>
          <CalendarMonthView date={date} setDate={this.setDate} />
          <Text style={styles.subtitle}>{moment(date).format('dddd')}</Text>
          {tasks && tasks.length > 0 ? (
            renderTasks()
          ) : (
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardItem} bordered>
                <Text style={styles.text}>No tasks found!</Text>
              </CardItem>
            </Card>
          )}
        </Content>
        {pickerOpen ? (
          <DateTimePicker
            value={date}
            mode='date'
            display='default'
            onChange={this.handleDateChange}
          />
        ) : null}
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
              navigation.navigate('AddEvent', {
                date: moment(date).format('YYYY-MM-DD'),
                onAdd: this.updateTasks,
              });
              this.setState({ fabOpen: false });
            }}
          >
            <Feather name='plus' size={24} color='white' />
          </Button>
        </Fab>
      </Container>
    );
  }
}
