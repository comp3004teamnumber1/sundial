import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Content, View } from 'native-base';
import { queryHourlyWeekly } from './components/queryHourlyWeekly.js'
import { EvilIcons, Feather } from 'react-native-vector-icons';
import { dummy } from './components/constants';
import HourlyView from './WeatherScreen/HourlyView';

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
  windView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  windText: {
    flex: 0,
    margin: 0,
    color: '#FFFFFF',
    fontSize: 30,
    marginTop: 5,
  }
});



export default function HomeScreen() {

  const HourlyWeeklyData = queryHourlyWeekly();
  const hourly = HourlyWeeklyData.hourly.data.hours;
  const weekly = HourlyWeeklyData.weekly.data.days;
  return (
    <Container style={styles.container}>
      <Container style={styles.wrapper}>
        <StatusBar />
        <View style={styles.locationView}>
          <EvilIcons name='location' numberOfLines={1} size={50} color='white' style={{marginTop: 7}}/>
          <Text style={styles.locationText}>Placeholder</Text>
        </View>
        <View style={styles.windView}>
          <Feather name='wind' numberOfLines={1} size={50} color='white'/>
          <Text style={styles.windText}>12 m/s E</Text>
        </View>
        <HourlyView data={hourly || dummy.hourlyViewTestPayload} />
      </Container>
    </Container>
  );
}
