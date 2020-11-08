import React, { Component } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, List, Text, Fab, Spinner, Button } from 'native-base';
import axios from 'axios';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { constants, getSessionKey, icon, setStorageKey } from './../components/constants';

let places = [ //TODO: Make it so that places is a query from our asyncStorage
  'London',
  'Thunder Bay',
  'Ottawa',
  'Nepean'
];

export default class WeatherNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: places.map(place => { return { [place]: null } }),
      fabOpen: false,
    }
  }
  async componentDidMount() {
    let places = this.state.places.map(
      place => Object.keys(place)[0]
    );

    if (places.length === 0) return;
    let sessionKey = await getSessionKey();
    const headers = {
      headers: {
        'Session-Key': sessionKey
      }
    };
    let promises = places.map(async place =>
      axios.get(`https://sundial.vinhnguyen.ca/daily?location=${place}`, headers)
    );
    let res = (await Promise.all(promises)).map(res => {
      return {
        data: res.data.days[0]
      }
    });

    this.setState({
      places: places.map((place, i) => { return { [place]: res[i] } })
    });
  }
  render() {
    return (
      <Container style={styles.container}>
        <Text style={styles.header}>
          Saved Locations
        </Text>

        <List
          horizontal={false}
          dataArray={this.state.places}
          showsHorizontalScrollIndicator={false}
          overScrollMode='never'
          renderRow={area => {
            //If the state doesn't cotain actual information yet
            if (Object.values(this.state.places[0])[0] === null) {
              console.log('Nothing in the state');
              return (
                <Pressable style={styles.pressable}>
                  <Spinner color='#FF8C42' />
                </Pressable>
              );
            }
            let place = Object.keys(area)[0];
            let data = area[place].data;
            return (
              <Pressable style={styles.pressable}
                onPress={async () => {
                  await setStorageKey('current_location', place);
                  this.props.navigation.navigate('WeatherView');
                }}
              >
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
                    {icon(data.weather_type)}
                    {' °' + data.temp.c + '°'}
                  </Text>
                </Pressable>
              </Pressable>
            );
          }}
          keyExtractor={(data, i) => 'location  ' + i.toString()}
        />
        <Fab
          active={this.state.fabOpen}
          direction='up'
          style={styles.fab}
          position='bottomRight'
          onPress={(() => {
            this.setState({ fabOpen: !fabOpen });
          })}
        >
          <Feather name='edit-3' size={24} color='white' />
          <Button
            style={{ backgroundColor: '#6699CC' }}
            onPress={() => {this.props.navigation.navigate('AddWeatherLocation')}}
          >
            <Feather name='plus' size={24} color='white' />
          </Button>
        </Fab>
      </Container >
    );
  }
}

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
  },
  fab: {
    backgroundColor: '#FF8C42'
  }
});
