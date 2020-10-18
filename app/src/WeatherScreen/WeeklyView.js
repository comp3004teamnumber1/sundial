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
      case 'Clear':
        return <Feather name="sun" size={48} color="white" />;
      case 'Clouds':
        return <Feather name="cloud" size={48} color="white" />;
      case 'Rain':
        return <Feather name="cloud-rain" size={48} color="white" />;
      case 'Drizzle':
        return <Feather name="cloud-drizzle" size={48} color="white" />;
      case 'Thunderstorm':
        return <Feather name="cloud-lightning" size={48} color="white" />;
      case 'Snow':
        return <Feather name="cloud-snow" size={48} color="white" />;
      default:
        return <Feather name="help-circle" size={48} color="white" />;
    }
  };

  return (
    <Container style={styles.container}>
      <List
        horizontal={true}
        dataArray={props.data}
        showsHorizontalScrollIndicator={false}
        overScrollMode='never'
        renderRow={data => {
          console.log(data);
          return (
            <Pressable style={moment().format('ddd') === data.date ? styles.activeListItem : styles.listItem}>
              <Text style={styles.textDate}>{moment.unix(data.date).format('ddd')}</Text>
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