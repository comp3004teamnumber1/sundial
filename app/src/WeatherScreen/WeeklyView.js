import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { getWeatherIcon } from '../components/constants.js';

const styles = StyleSheet.create({
  container: {
    maxHeight: 220,
    borderColor: '#332E3C',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderRadius: 10,
    minWidth: '100%',
    backgroundColor: '#332E3C',
    zIndex: 1,
  },
  listItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#332E3C',
    height: 220,
    width: 85,
    paddingVertical: 18,
    zIndex: 0,
  },
  activeListItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    height: 220,
    width: 85,
    paddingVertical: 18,
    zIndex: 0,
  },
  textDate: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
  },
  textWeather: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 23,
    fontWeight: 'bold',
  },
  textPrecip: {
    textAlign: 'center',
    color: '#6699CC',
    fontSize: 12,
  },
  textHumidity: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12,
  },
});

export default function WeeklyView({ data }) {

  return (
    <Container style={styles.container}>
      <List
        horizontal
        dataArray={data}
        showsHorizontalScrollIndicator={false}
        overScrollMode='never'
        keyExtractor={(item, i) => `Day${i.toString()}`}
        renderRow={item => {
          return (
            <Pressable
              style={
                moment().format('ddd') === item.date
                  ? styles.activeListItem
                  : styles.listItem
              }
            >
              <Text style={styles.textDate}>
                {moment.unix(item.date).format('ddd')}
              </Text>
              {getWeatherIcon(item.weather_type)}
              <Text style={styles.textWeather}> {`${item.temp.c}°`} </Text>
              <Text style={styles.textPrecip}>
                {`${item.pop}%`}
                <Entypo name='drop' size={12} color='#6699CC' />
                <Text style={styles.textHumidity}> {`${item.humidity}`}</Text>
              </Text>
            </Pressable>
          );
        }}
      />
    </Container>
  );
}
