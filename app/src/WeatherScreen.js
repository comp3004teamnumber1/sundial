import React, { Component } from 'react';
import { Pressable, StatusBar, StyleSheet, View, ScrollView, LogBox } from 'react-native';
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
import { icon } from './components/constants';

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
      weekly: null,
      location: null
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    // get relevant info for request
    const [session_key, location] = await Promise.all([
      getSessionKey(),
      getStorageKey('current_location'),
    ]);

    this.setState({ location: location });

    // build query
    const queryParams = {
      location: location || 'Ottawa, Ontario',
    };
    const queryString = `?${Object.entries(queryParams)
      .map(([k, v], i) => `${k}=${v}`)
      .join('&')}`;
    const config = {
      headers: {
        'Session-Key': session_key,
      },
    };

    // query data
    let hourlyRes;
    let weeklyRes;
    try {
      [hourlyRes, weeklyRes] = await Promise.all([
        axios.get(`${constants.SERVER_URL}/hourly${queryString}`, config),
        axios.get(`${constants.SERVER_URL}/daily${queryString}`, config),
      ]);
    } catch (e) {
      console.log('An error occurred while fetching weather data.');
      console.error(e);
      return;
    }

    // set our state
    this.setState({
      hourly: hourlyRes.data.hours,
      weekly: weeklyRes.data.days,
    });
  }

  render() {
    const { hourly, weekly } = this.state;
    return (
      <ScrollView style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Pressable
            onPress={() => this.props.navigation.navigate('WeatherNavigation')}
          >
            <Text style={styles.title}>
              {this.state.location}
            </Text>
            <Text style={styles.locationDescription}>
              Clear Skies
            </Text>
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
            <HourlyView data={hourly || dummy.hourlyViewTestPayload} />
            <Text style={styles.subtitle}>Daily</Text>
            <WeeklyView data={weekly || dummy.weeklyViewTestPayload} />
          </Container>
        </Content>
      </ScrollView>
    );
  }
}
