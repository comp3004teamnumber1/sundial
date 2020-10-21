import React, { Component } from 'react';
import { StatusBar, StyleSheet, LogBox } from 'react-native';
import { Container, Text, Content } from 'native-base';
import axios from 'axios';
import HourlyView from './WeatherScreen/HourlyView';
import WeeklyView from './WeatherScreen/WeeklyView';

let weeklyViewTestPayload = [
  {
    date: 1602960464,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clouds',
    pop: 32,
    humidity: 12,
  },
  {
    date: 1603046864,
    temp: {
      c: 2.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clear',
    pop: 32,
    humidity: 12,
  },
  {
    date: 1603133264,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clear',
    pop: 32,
    humidity: 12,
  },
  {
    date: 1602097200,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clear',
    pop: 32,
    humidity: 12,
  },
  {
    date: 1603392464,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clear',
    pop: 32,
    humidity: 12,
  },
  {
    date: 1603478864,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clear',
    pop: 32,
    humidity: 12,
  },
];

let hourlyViewTestPayload = [
  {
    date: 1602086400,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather: 'Clear',
  },
  {
    date: 1602090000,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather: 'Clear',
  },
  {
    date: 1602093600,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather: 'Clear',
  },
  {
    date: 1602097200,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather: 'Clear',
  },
  {
    date: 1602100800,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather: 'Clear',
  },
  {
    date: 1602104400,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather: 'Clear',
  },
];

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
    let options = {
      username: 'nick',
      session_key: '5bb92746-46b0-4b74-80b4-592f44f93e4b',
      location: 'Ottawa, Ontario',
    };
    let url = `http://10.0.2.2:5000/hourly?${Object.entries(options)
      .map(([k, v], i) => `${k}=${v}`)
      .join('&')}`;
    axios.get(url).then(res => {
      this.setState({ hourly: res.data.hours });
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
            <HourlyView data={hourly || hourlyViewTestPayload} />
            <WeeklyView data={weekly || weeklyViewTestPayload} />
          </Container>
        </Content>
      </Container>
    );
  }
}
