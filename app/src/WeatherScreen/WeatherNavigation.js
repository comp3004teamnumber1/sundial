import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { WeatherScreen } from './../WeatherScreen';
import { Feather } from '@expo/vector-icons';
import { icon } from './../components/constants';

const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: '#332E3C'
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    paddingBottom: 15
  },
  pressable: {
    paddingLeft: 15,
    borderBottomColor: '#FF8C42',
    borderWidth: 1,
    borderLeftColor: '#332E3C',
    borderRightColor: '#332E3C',
    backgroundColor: '#332E3C',
    height: 120
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 48
  },
  locationInfo: {
    color: '#FFFFFF',
    fontSize: 24
  }
});

let places = [
  'London',
  'Thunder Bay',
  'Ottawa',
  'Nepean',
]

export default function WeatherNavigation() {

  let locations = (place, props) => {
    return (<Drawer.Screen name={place} component={WeatherScreen} />)
  }
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>
        Saved Locations
      </Text>
      <List
        horizontal={false}
        dataArray={places}
        showsHorizontalScrollIndicator={false}
        overScrollMode='never'
        renderRow={place => {
          return (
            <Pressable style={styles.pressable}>
              <Text style={styles.locationText}>
                <Feather name={'map-pin'} size={24} color='white' />
                {place}
              </Text>
              <Pressable style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={styles.locationInfo}>
                  {icon('wind')}
                  5.7 m/s
                  W
                </Text>
                <Text style={styles.locationInfo}>
                  {icon('drizzle')}
                  10deg
                </Text>
              </Pressable>
            </Pressable>
          );
        }}
        keyExtractor={(data, i) => 'location  ' + i.toString()}
      />
    </Container>
  );
}