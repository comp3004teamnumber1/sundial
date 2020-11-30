import React, { Component } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, Content, Container } from 'native-base';
import { dummy } from '../data/constants';
import { getStorageKey } from '../util/Storage';
import { getIcon, getWindDirection } from '../util/Util';
import query from '../util/SundialAPI';
import HourlyView from './HourlyView';
import WeeklyView from './WeeklyView';
import Header from '../components/Header';

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#231F29',
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
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
    textAlign: 'center',
  },
  locationDescription: {
    textAlign: 'justify',
    color: '#ffffff',
    fontStyle: 'italic',
    fontSize: 24,
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
      units: '',
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('focus', async () => {
      await this.getVitalData();
    });
  }

  async getVitalData() {
    // get relevant info for request
    const [location, units] = await Promise.all([
      getStorageKey('current_location'),
      getStorageKey('units'),
    ]);

    // query data
    const data = {
      location: location || 'Ottawa, Ontario',
      units: units || 'metric',
    };
    const [hourly, weekly] = await Promise.all([
      query('hourly', 'get', data),
      query('daily', 'get', data),
    ]);
    if (!hourly || !weekly || hourly.status !== 200 || weekly.status !== 200) {
      console.log('An error occurred while querying weather');
      // Deen, i'll let you decide where to go from here
    }

    // set our state
    this.setState({
      location: location || this.state.location,
      units: units || this.state.units,
      hourly: hourly.hours || this.state.hourly,
      weekly: weekly.days.slice(0, weekly.days.length - 1) || this.state.weekly,
    });
  }

  render() {
    const { hourly, weekly, units, location } = this.state;
    const { navigation } = this.props;
    return (
      <Content contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.navigate('WeatherNavigation')}>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            {location}
          </Text>
          <Text style={styles.locationDescription}>
            {hourly[0].weather_type}
          </Text>
        </Pressable>
        <View style={styles.locationView}>
          <Text style={styles.locationSummary}>
            {getIcon('Wind', 24)}
            {`${hourly[0].wind_speed} ${getWindDirection(hourly[0].wind_deg)}`}
          </Text>
          <Text style={styles.locationSummary}>
            {getIcon('Drizzle', 24)}
            {` ${hourly[0].pop}%`}
          </Text>
          <Text style={styles.locationSummary}>
            {getIcon('Drop', 24)}
            {` ${hourly[0].humidity}%`}
          </Text>
          <Text style={styles.locationSummary}>
            {/* TODO: Read UV from hourly */}
            {`UV: ${hourly[0].uvi}`}
          </Text>
        </View>
        <Text style={styles.subtitle}>Hourly</Text>
        <HourlyView data={hourly} units={units} />
        <Text style={styles.subtitle}>Daily</Text>
        <WeeklyView data={weekly} units={units} />
      </Content>
    );
  }
}
