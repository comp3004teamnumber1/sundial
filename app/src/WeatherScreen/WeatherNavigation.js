import React, { Component } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Card, CardItem, Fab, List, Spinner, Text } from 'native-base';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { constants, getSessionKey, icon, setStorageKey, getStorageKey } from './../components/constants';

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
      currentLocation: ''
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
      axios.get(`${constants.SERVER_URL}/daily?location=${place}`, headers)
    );
    let res = (await Promise.all(promises)).map(res => {
      return {
        data: res.data.days[0]
      }
    });
    this.setState({
      places: places.map((place, i) => { return { [place]: res[i] } }),
      currentLocation: await getStorageKey('current_location')
    });
  }
  render() {
    let ready = (Object.values(this.state.places[0])[0] !== null);
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>
          Locations
        </Text>

        {this.state.places.map(
          information => {
            let place = Object.keys(information)[0];
            let data = information[place] === null ? undefined : information[place].data;
            return (
              <Card key={'card ' + place} style={{ borderColor: '#231F29' }}>
                {!ready ?
                  <CardItem
                    style={styles.card}
                    bordered>
                    <Text style={styles.locationText}>
                      <Feather name={'map-pin'} size={24} color='white' />
                      {place}
                    </Text>
                    <Spinner color='#FF8C42' />
                  </CardItem>
                  :
                  <CardItem
                    style={this.state.currentLocation === place ? styles.currentCard : styles.card}
                    bordered button
                    onPress={async () => {
                      await setStorageKey('current_location', place);
                      this.setState({ currentLocation: place }); //Forces re-render
                      this.props.navigation.navigate('WeatherView');
                    }}
                  >
                    <Text style={styles.locationText}>
                      <Feather name={'map-pin'} size={24} color='white' />
                      {place}
                    </Text>
                    <Pressable style={styles.weatherInformation}>
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
                  </CardItem>
                }
              </Card>
            );
          }
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: '#332E3C',
  },
  header: {
    color: '#FFFFFF',
    fontSize: 48,
    textAlign: 'center',
    paddingVertical: 15
  },
  card: {
    paddingLeft: 15,
    backgroundColor: '#332E3C',
    height: 120,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  currentCard: {
    paddingLeft: 15,
    backgroundColor: '#FF8C42',
    height: 120,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 48,
    width: '100%',
  },
  locationInfo: {
    color: '#FFFFFF',
    fontSize: 24
  },
  fab: {
    backgroundColor: '#FF8C42'
  },
  delete: {
    backgroundColor: 'white',
    width: 80,
    height: '100%'
  },
  weatherInformation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
