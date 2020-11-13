import React, { Component } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, CardItem, Fab, Spinner, Text, View } from 'native-base';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { constants, getSessionKey, icon, setStorageKey, getStorageKey, getUnits } from './../components/constants';
import Modal from 'react-native-modal';
import AddWeatherLocation from './AddWeatherLocation'

let places = [ //TODO: Make it so that places is a query from our asyncStorage
  'London',
  'Thunder Bay',
  'Ottawa',
  'Nepean',
  'Dhaka'
];

export default class WeatherNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: places.map(place => { return { [place]: null } }),
      currentLocation: '',
      units: '',
      fabOpen: false,
      modalVisible: true
    }
  }
  async componentDidMount() {
    let places = this.state.places.map(
      place => Object.keys(place)[0]
    );

    if (places.length === 0) return;

    this.setState({ units: await getStorageKey('units') });
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
      <View>
        <ScrollView style={styles.container}>
          <Text style={styles.header}>
            Locations
        </Text>

          {this.state.places.map(
            information => {
              let place = Object.keys(information)[0];
              let data = information[place] === null ? undefined : information[place].data;
              return (
                <Card key={'card ' + place} style={styles.card}>
                  {!ready ?
                    <CardItem
                      style={styles.cardItem}
                      bordered>
                      <Text style={styles.locationText}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        allowFontScaling
                        minimumFontScale={0}
                      >
                        <Feather name={'map-pin'} size={24} color='white' />
                        {place}
                      </Text>
                      <Spinner color='#FF8C42' />
                    </CardItem>
                    :
                    <CardItem
                      style={this.state.currentLocation === place ? styles.currentCardItem : styles.cardItem}
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
                      <View style={styles.weatherInformation}>
                        <Text style={styles.locationInfo}>
                          {icon('wind')}
                        5.7 m/s
                        W
                      </Text>
                        <Text style={styles.locationInfo}>
                          {icon(data.weather_type)}
                          {` ${data.temp.toFixed(1)}${getUnits(this.state.units).temp}`}
                        </Text>
                      </View>
                    </CardItem>
                  }
                </Card>
              );
            }
          )}
        </ScrollView>
        <Fab
          active={this.state.fabOpen}
          direction='up'
          style={styles.fab}
          position='bottomRight'
          onPress={(() => {
            this.setState({ fabOpen: !this.state.fabOpen });
          })}
        >
          <Feather name='edit-3' size={24} color='white' />
          <Button
            style={{ backgroundColor: '#6699CC' }}
            // onPress={() => { this.props.navigation.navigate('AddWeatherLocation') }}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Feather name='plus' size={24} color='white' />
          </Button>
        </Fab>
        <Modal
          style={styles.modal}
          isVisible={this.state.modalVisible}
          onBackdropPress={(() => this.setState({ modalVisible: false }))}
          onSwipeDirection='down'
          onSwipeComplete={(() => this.setState({ modalVisible: false }))}
          animationIn='slideInDown'
          animationOut='slideOutUp'
        >
          <AddWeatherLocation />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#332E3C',
  },
  header: {
    color: '#FFFFFF',
    fontSize: 48,
    textAlign: 'center',
    paddingVertical: 15,
  },
  card: {
    flex: 1,
    flexShrink: 0,
    minHeight: 140,
    borderColor: '#231F29',
    backgroundColor: '#332E3C',
  },
  cardItem: {
    borderColor: '#231F29',
    paddingLeft: 15,
    backgroundColor: '#332E3C',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  currentCardItem: {
    borderColor: '#231F29',
    paddingLeft: 15,
    backgroundColor: '#FF8C42',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 48,
    width: '100%',
    // flex: 0
  },
  locationInfo: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  fab: {
    backgroundColor: '#FF8C42',
  },
  weatherInformation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    justifyContent: 'flex-start',
    margin: 10
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    height: '20%',
    width: '100%'
  }
});
