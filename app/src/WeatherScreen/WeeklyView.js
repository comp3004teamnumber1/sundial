import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { icon } from './../components/constants';

const styles = StyleSheet.create({
  container: {
    maxHeight: 240,
    borderColor: '#332E3C',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderRadius: 10,
    minWidth: '100%',
    backgroundColor: '#332E3C',
    zIndex: 1
  },
  listItem: {
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#332E3C',
    height: 350,
    width: 85,
    paddingVertical: 18,
    zIndex: 0,
  },
  activeListItem: {
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    height: 350,
    width: 85,
    paddingVertical: 18,
    zIndex: 0,
  },
  textDate: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 35
  },
  textWeather: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20
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
  return (
    <Container style={styles.container}>
      <List
        horizontal={true}
        dataArray={props.data}
        showsHorizontalScrollIndicator={false}
        overScrollMode='never'
        renderRow={data => {
          return (
            <Pressable style={moment().format('ddd') === data.date ? styles.activeListItem : styles.listItem}>
              <Text style={styles.textDate}>{moment.unix(data.date).format('ddd')}</Text>
              {icon(data.weather_type)}
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