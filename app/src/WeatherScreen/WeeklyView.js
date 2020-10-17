import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';
import { Entypo, Feather } from '@expo/vector-icons';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    maxHeight: 220,
    borderColor: '#332E3C',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderRadius: 10,
    minWidth: '100%',
    backgroundColor: '#332E3C',
    zIndex: 1
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
    fontWeight: 'bold'
  },
  textPrecip: {
    textAlign: 'center',
    color: '#6699CC',
    fontSize: 12
  },
  textHumidity: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12
  }
});

export default function WeeklyView(props) {
  const weatherIcon = weather => {
    switch (weather) {
      case 'clear':
      default:
        return <Feather name='sun' size={48} color='white' />;
    }
  };

  let payload = [
    {
      date: 1602960464,
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

  let week = payload.map(
    (x) => {
      return {
        ...x,
        date: moment.unix(x.date).format('ddd')
      }
    }
  );

  while (week[0].date !== 'Mon') {
    week.push(week.shift());
    console.log('monka');
  }
  return (
    <Container style={styles.container}>
      <List
        horizontal={true}
        dataArray={week}
        showsHorizontalScrollIndicator={false}
        overScrollMode='never'
        renderRow={data => {
          console.log('data');
          console.log(data);
          return (
            <Pressable style={moment().format('ddd') === data.date ? styles.activeListItem : styles.listItem}>
              <Text style={styles.textDate}>{data.date}</Text>
              {weatherIcon(data.weather_type)}
              <Text style={styles.textWeather}> {data.temp.c + '°'} </Text>
              <Text style={styles.textPrecip}>
                {data.pop + '%'}
                <Entypo name='drop' size={12} color='#6699CC' />
                <Text style={styles.textHumidity}> {data.humidity + '%'}</Text>
              </Text>
            </Pressable>
          );
        }}
        keyExtractor={(data, i) => 'Day' + i.toString()}
      />
    </Container >
  );
}