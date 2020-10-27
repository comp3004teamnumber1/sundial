import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';

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
  },
  tempPrimary: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tempSecondary: {
    textAlign: 'center',
    color: '#6699CC',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

let locations = [
  'London',
  'Thunder Bay',
  'Perth'
]

export default function WeatherNavigation() {
  return (
    <Container style={styles.container}>

    </Container>
  );
}