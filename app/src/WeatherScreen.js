import React, { Component } from 'react';
import { StatusBar, StyleSheet, LogBox } from 'react-native';
import { Container, Text, Content } from 'native-base';
import axios from 'axios';
import {
  getStorageKey,
  getSessionKey,
  constants,
  dummy,
} from './components/constants';
import HourlyView from './WeatherScreen/HourlyView';
import WeeklyView from './WeatherScreen/WeeklyView';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
  },
  container: {
    backgroundColor: '#231F29',
  },
  view: {
    marginVertical: 12,
    backgroundColor: '#231F29',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 24,
    paddingVertical: 12,
  },
});

export default class WeatherScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hourly: null,
      weekly: null,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    // get relevant info for request
    const [username, session_key, location] = await Promise.all([
      getStorageKey('username'),
      getSessionKey(),
      getStorageKey('current_location'),
    ]);

    // build query
    const queryParams = {
      username,
      location: location || 'Ottawa, Ontario',
    };
    const queryString = `?${Object.entries(queryParams)
      .map(([k, v], i) => `${k}=${v}`)
      .join('&')}`;
    const config = {
      headers: {
        session_key,
      },
    };

    // query data
    const [hourlyRes, weeklyRes] = await Promise.all([
      axios.get(`${constants.SERVER_URL}/hourly${queryString}`, config),
      axios.get(`${constants.SERVER_URL}/daily${queryString}`, config),
    ]);

    // set our state
    this.setState({
      hourly: hourlyRes.data.hours,
      weekly: weeklyRes.data.days,
    });
  }

  render() {
    const { hourly, weekly } = this.state;

    return (
      <Container style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.title}>Weather</Text>
          <Container style={styles.view}>
            <Text style={styles.subtitle}>Hourly</Text>
            <HourlyView data={hourly || dummy.hourlyViewTestPayload} />
            <Text style={styles.subtitle}>Daily</Text>
            <WeeklyView data={weekly || dummy.weeklyViewTestPayload} />
          </Container>
        </Content>
      </Container>
    );
  }
}
