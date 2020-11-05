import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { queryHourlyWeekly } from './components/queryCalendar.js'
import { EvilIcons } from 'react-native-vector-icons';
import { dummy, setStorageKey } from './components/constants';
import moment from 'moment';
import HourlyView from './WeatherScreen/HourlyView';
import UpNext from './Calendar/UpNext'
import * as Location from 'expo-location';
import LoadingComponent from './components/loadingComponent';
import { queryTasks } from './components/queryTasks'

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
    justifyContent: "center",
    alignItems: 'center',
  },
  spinner: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  padded: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#231F29',
  }
});



export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
  }

  async componentDidMount() {
    // query data
    const HourlyWeeklyData = await queryHourlyWeekly();
    const tasks = await queryTasks();

    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});

    let city = await Location.reverseGeocodeAsync({
      latitude : location.coords.latitude,
      longitude : location.coords.longitude
    });
    setStorageKey("current_location", city[0].city);

    await this.setState({
      hourly: HourlyWeeklyData.hourly.data.hours,
      currLocation: location,
      currCity: city,
      ready: true,
      tasks: tasks.tasks
    });
  }

  render() {
    let { ready } = this.state;
    if (ready) {
      const { hourly, currCity, tasks } = this.state;
      const now = moment().format('MMM DD h:mm A');

      return (
        <Container style={styles.container}>
          <Container style={styles.wrapper}>
            <StatusBar />
            <View style={styles.locationView}>
              <EvilIcons name='location' numberOfLines={1} size={50} color='white' style={{marginTop: 7}}/>
              <Text style={styles.locationText}>{currCity[0].city}</Text>
            </View>
            <View style={styles.dateView}>
              <Text style={styles.dateText}>{now}</Text>
            </View>
            <Container style={styles.padded}>
              <UpNext style={styles.padded} data={tasks || dummy.taskPayload}/>
            </Container>
            <Container style={styles.padded}>
              <HourlyView style={styles.padded} data={hourly} />
            </Container>
          </Container>
        </Container>
      );
    } else {
      return (
        <LoadingComponent/>
      )
    }    
  }
}
