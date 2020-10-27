import React, { Component } from 'react';
import { Pressable, StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import { Container, Text, Content } from 'native-base';
import HourlyView from './WeatherScreen/HourlyView';
import axios from 'axios';
import WeeklyView from './WeatherScreen/WeeklyView';
import { Feather } from '@expo/vector-icons';
import { icon } from './components/constants';

let WeeklyViewTestPayload = [
  {
    date: 1602960464,
    temp: {
      c: 21.8,
      f: 71.2,
      k: 295.95,
    },
    weather_type: 'Clouds',
    pop: 32,
    humidity: 12
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
    humidity: 12
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
    humidity: 12
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
    humidity: 12
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
    humidity: 12
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
    humidity: 12
  },
];

let HourlyViewTestPayload = [
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
  locationView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    minHeight: 60,
    maxHeight: 60,
  },
  locationTitle: {
    color: '#ffffff',
    textAlign: 'center'
  },
  locationDescription: {
    textAlign: 'justify',
    color: '#ffffff',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 24
  },
  locationSummary: {
    color: '#ffffff',
    textAlign: 'center',
    width: '50%',
    fontSize: 24,
  },
});

export default class WeatherScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hourly: null,
      weekly: null
    };
  }

  componentDidMount() {
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
    return (
      <ScrollView style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Pressable>
            <Text style={styles.title}> Location </Text>
            <Text style={styles.locationDescription}> Clear Skies </Text>
          </Pressable>
          <View style={styles.locationView}>
            <Text style={styles.locationSummary}>
              {icon('Wind', 24)}
                5.7 m/s
                W
            </Text>
            <Text style={styles.locationSummary}>
              {icon('Drizzle', 24)}
              {'28%'}
            </Text>
            <Text style={styles.locationSummary}>
              {icon('Drop', 24)}
              43%
            </Text>
            <Text style={styles.locationSummary}>
              UV: Low
            </Text>
          </View>
          <Container style={styles.view}>
            <Text style={styles.subtitle}>Hourly</Text>
            <HourlyView
              data={this.state.hourly ? this.state.hourly : HourlyViewTestPayload}
            />
            <Text style={styles.subtitle}>Daily</Text>
            <WeeklyView
              data={this.state.weekly ? this.state.weekly : WeeklyViewTestPayload}
            />
          </Container>
        </Content>
      </ScrollView>
    );
  }
}
