import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { icon } from './../components/constants';

const styles = StyleSheet.create({
  container: {
    maxHeight: 220,
    borderColor: '#332E3C',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderRadius: 10,
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
  listItemActive: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    height: 220,
    width: 85,
    paddingVertical: 18,
    zIndex: 0,
  },
  text: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 35
  },
  tempPrimary: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40
  }
});

export default function HourlyView({ data }) {
  const now = moment();
  return (
    <Container style={styles.container}>
      <List
        horizontal={true}
        dataArray={data}
        showsHorizontalScrollIndicator={false}
        overScrollMode='never'
        keyExtractor={(item, index) => 'Hour' + index.toString()}
        renderRow={item => {
          let time = moment.unix(item.date);
          return (
            <Pressable
              style={
                now.hour() === time.hour()
                  ? styles.listItemActive
                  : styles.listItem
              }
              key={item.date}
            >
              <Text style={styles.text}>{time.format('h A')}</Text>
              {icon(item.weather_type)}
              <Text style={styles.tempPrimary}>{`${item.temp.c}°`}</Text>
            </Pressable>
          )
        }}
      />
    </Container>
  );
}
