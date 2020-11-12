import React, { Component } from 'react';
import { Pressable, StatusBar, StyleSheet, View, ScrollView, LogBox } from 'react-native';
import { Container, Text, Content } from 'native-base';
import { dummy, icon, windDirection, getSessionKey, getStorageKey } from '../components/constants';
import { queryHourlyWeekly } from '../components/queryCalendar.js'
import HourlyView from './HourlyView';
import WeeklyView from './WeeklyView';

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
      hourly: dummy.hourlyViewTestPayload,
      weekly: dummy.weeklyViewTestPayload,
      location: null,
      units: ''
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    // get relevant info for request
    const [session_key, location] = await Promise.all([
      getSessionKey(),
      getStorageKey('current_location')
    ]);

    this.setState({ location: location });

    // query data
    const HourlyWeeklyData = await queryHourlyWeekly();

    // set our state
    this.setState({
      hourly: HourlyWeeklyData.hourly.data.hours,
      weekly: HourlyWeeklyData.weekly.data.days.slice(0, HourlyWeeklyData.weekly.data.days.length - 1),
      units: HourlyWeeklyData.units
    });
  }

  render() {
    const { hourly, weekly, units } = this.state;
    return (
      <ScrollView style={styles.container}>
        <StatusBar />
        <Content contentContainerStyle={styles.content}>
          <Pressable
            onPress={() => this.props.navigation.navigate('WeatherNavigation')}
          >
            <Text style={styles.title}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {this.state.location}
            </Text>
            <Text style={styles.locationDescription}>
              {hourly[0].weather_type}

            </Text>
          </Pressable>
          <View style={styles.locationView}>
            <Text style={styles.locationSummary}>
              {icon('Wind', 24)}
              {`${hourly[0].wind_speed} ${windDirection(hourly[0].wind_deg)}`}
            </Text>
            <Text style={styles.locationSummary}>
              {icon('Drizzle', 24)}
              {` ${hourly[0].pop}%`}
            </Text>
            <Text style={styles.locationSummary}>
              {icon('Drop', 24)}
              {` ${hourly[0].humidity}%`}
            </Text>
            <Text style={styles.locationSummary}>
              {/* TODO: Read UV from hourly */}
              UV: Low
            </Text>
          </View>
          <Container style={styles.view}>
            <Text style={styles.subtitle}>Hourly</Text>
            <HourlyView data={hourly} units={units} />
            <Text style={styles.subtitle}>Daily</Text>
            <WeeklyView data={weekly} units={units} />
          </Container>
        </Content>
      </ScrollView>
    );
  }
}
