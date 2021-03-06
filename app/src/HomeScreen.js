import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { EvilIcons } from 'react-native-vector-icons';
import * as Location from 'expo-location';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

import { dummy } from './data/constants';
import { getStorageKey, setStorageKey } from './util/Storage';
import query from './util/SundialAPI';
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
  sendPushToken,
} from './util/pushNotifications';

// components
import HourlyView from './Weather/HourlyView';
import WeeklyView from './Weather/WeeklyView';
import UpNext from './Calendar/UpNext';
import Loading from './components/Loading';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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
      displayHourlyView: false, // if true is passed in, homescreen displays hourly info. If false, weekly info.
      weather: null,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('focus', async () => {
      await this.getVitalData();
    });

    // register for notifications
    expoPushToken = await registerForPushNotificationsAsync();
    sendPushToken(expoPushToken);
    this.onResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse
    );

    // setTimeout(() => {
    //   console.log('Sending Notif...');
    //   sendPushNotification(expoPushToken);
    // }, 3000);
  }

  componentWillUnmount() {
    Notifications.removeNotificationSubscription(
      this.onResponseReceivedListener
    );
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
    // get saved locations
    const savedLocations = await getStorageKey('saved_locations');
    if (!savedLocations) {
      await setStorageKey('saved_locations', `{"${city[0].city}":null}`);
    } else {
      let locations = savedLocations
        .split('|')
        .map(place => JSON.parse(place))
        .map(json => Object.keys(json)[0]);

      if (!locations.includes(city[0].city)) {
        await setStorageKey(
          'saved_locations',
          `${savedLocations}|{"${city[0].city}":null}`
        );
      }
    }

    const displayHourlyView = JSON.parse(
      await getStorageKey('home_screen_displays_hourly_view')
    );
    // query
    const weather = await query(displayHourlyView ? 'hourly' : 'daily', 'get', {
      location: city[0].city,
      units,
    });
    const tasks = await query('task', 'get', { current: 'true' });
    if (!weather || !tasks || weather.status !== 200 || tasks.status !== 200) {
      console.log('An error occurred while querying hourly/tasks');
      alert('Contact naek.ca for errors.');
      return;
    }

    this.setState({
      units,
      displayHourlyView,
      weather: displayHourlyView
        ? weather.hours
        : weather.days.slice(0, weather.days.length - 1),
      currCity: city,
      ready: true,
      tasks: tasks.tasks,
    });
  }

  handleNotificationResponse = res => {
    const { navigation } = this.props;
    if (
      res.notification.request.content.title === 'Event weather has changed.'
    ) {
      const data = res.notification.request.content.data.suggestions;
      navigation.navigate('Calendar', {
        screen: 'Suggested',
        params: { data },
      });
    }
  };

  render() {
    let { ready } = this.state;
    if (ready) {
      const { weather, currCity, tasks, units, displayHourlyView } = this.state;
      const now = moment().format('MMM DD h:mm A');

      return (
        <ScrollView style={styles.container}>
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
              <Text style={styles.subtitle}>
                {`${displayHourlyView ? 'Hourly' : 'Daily'}:`}
              </Text>
              {displayHourlyView ? (
                <HourlyView
                  style={styles.padded}
                  data={weather}
                  units={units}
                />
              ) : (
                <WeeklyView
                  style={styles.padded}
                  data={weather}
                  units={units}
                />
              )}
            </Container>
          </Container>
        </ScrollView>
      );
    }
    return <Loading />;
  }
}
