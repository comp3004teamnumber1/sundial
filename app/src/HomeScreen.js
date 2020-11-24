import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { EvilIcons } from 'react-native-vector-icons';
import * as Location from 'expo-location';
import moment from 'moment';
import { dummy } from './data/constants';
import { getStorageKey, setStorageKey } from './util/Storage';
import { registerForPushNotificationsAsync, sendPushNotification, sendPushToken } from './Notifications/pushNotifications.js';
import query from './util/SundialAPI';
// components
import HourlyView from './Weather/HourlyView';
import UpNext from './Calendar/UpNext';
import Loading from './components/Loading';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#231F29',
  },
  wrapper: {
    backgroundColor: '#231F29',
    marginHorizontal: 24,
    marginVertical: 24,
  },
  locationView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 0,
  },
  locationText: {
    flex: 0,
    margin: 0,
    color: '#FFFFFF',
    fontSize: 40,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateText: {
    flex: 0,
    margin: 0,
    color: '#FFFFFF',
    fontSize: 30,
    marginTop: 5,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  padded: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#231F29',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 24,
    padding: 8,
  },
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      units: '',
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('focus', async () => {
      await this.getVitalData();
    });
    expoPushToken = await registerForPushNotificationsAsync();
    sendPushToken(expoPushToken);
  }

  async getVitalData() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    let city = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const units = await getStorageKey('units');
    await setStorageKey('current_location', city[0].city);

    // query
    const hourly = await query('hourly', 'get', {
      location: city[0].city,
      units,
    });
    const tasks = await query('task', 'get', { current: 'true' });
    if (!hourly || !tasks || hourly.status !== 200 || tasks.status !== 200) {
      console.log('An error occurred while querying hourly/tasks');
      alert('Contact naek.ca for errors.');
    }

    this.setState({
      units,
      hourly: hourly.hours,
      currCity: city,
      ready: true,
      tasks: tasks.tasks,
    });
  }

  render() {
    let { ready } = this.state;
    if (ready) {
      const { hourly, currCity, tasks, units } = this.state;
      const now = moment().format('MMM DD h:mm A');

      return (
        <Container style={styles.container}>
          <Container style={styles.wrapper}>
            <StatusBar />
            <View style={styles.locationView}>
              <EvilIcons
                name='location'
                numberOfLines={1}
                size={50}
                color='white'
                style={{ marginTop: 7 }}
              />
              <Text style={styles.locationText}>{currCity[0].city}</Text>
            </View>
            <View style={styles.dateView}>
              <Text style={styles.dateText}>{now}</Text>
            </View>
            <Container style={styles.padded}>
              <Text style={styles.subtitle}>Up Next:</Text>
              <UpNext style={styles.padded} data={tasks || dummy.taskPayload} />
            </Container>
            <Container style={styles.padded}>
              <Text style={styles.subtitle}>Hourly:</Text>
              <HourlyView style={styles.padded} data={hourly} units={units} />
            </Container>
          </Container>
        </Container>
      );
    }
    return <Loading />;
  }
}
