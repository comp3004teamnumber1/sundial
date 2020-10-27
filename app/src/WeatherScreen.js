import React, { Component } from 'react';
import { StatusBar, StyleSheet, LogBox } from 'react-native';
import { Container, Text, Content } from 'native-base';
import axios from 'axios';
import { constants, dummy } from './components/constants';
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
    paddingBottom: 12,
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

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const options = {
      username: 'nick',
      session_key: '5bb92746-46b0-4b74-80b4-592f44f93e4b',
      location: 'Ottawa, Ontario',
    };
    const optionsUrl = Object.entries(options)
      .map(([k, v], i) => `${k}=${v}`)
      .join('&');
    axios.get(`${constants.SERVER_URL} /hourly?${optionsUrl}`).then(res => {
      this.setState({ hourly: res.data.hours });
    });
    axios.get(`${constants.SERVER_URL} /daily?${optionsUrl}`).then(res => {
      this.setState({ weekly: res.data.days });
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
            <WeeklyView data={weekly || dummy.weeklyViewTestPayload} />
          </Container>
        </Content>
      </Container>
    );
  }
}
