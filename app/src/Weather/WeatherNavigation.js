import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, CardItem, Fab, List, Text, View } from 'native-base';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { setStorageKey, getStorageKey } from '../util/Storage';
import { getIcon, getUnits, getWindDirection } from '../util/Util';
import query from './../util/SundialAPI';
import AddWeatherLocation from './AddWeatherLocation';
import Loading from '../components/Loading';

export default class WeatherNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: undefined,
      currentLocation: '',
      units: '',
      fabOpen: false,
      modalVisible: false,
    };
  }

  async delete(location) {
    // Although using state is faster, the source of truth for saved_locations comes from async storage

    let savedLocations = await getStorageKey('saved_locations');
    let locations = savedLocations.split('|')
      .map(place => JSON.parse(place))
      .map(json => Object.keys(json)[0]);

    let updatedLocationsInStringJSON = locations.filter(loc => loc !== location)
      .map(loc => `{"${loc}":null}`)
      .join('|');
    await setStorageKey('saved_locations', updatedLocationsInStringJSON);
    this.setState({ savedLocations: updatedLocationsInStringJSON })
  }

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('focus', async () => {
      await this.getVitalData();
    });
  }

  async getVitalData() {
    let savedLocations = await getStorageKey('saved_locations');
    let places = savedLocations ? savedLocations.split('|') : undefined;
    if (!places) {
      this.setState({ places: ['|Sorry, you have no saved locations yet'] })
      return;
    }

    places = places.map(place => Object.keys(JSON.parse(place))[0]);
    this.setState({ units: await getStorageKey('units') });
    let promises = places.map(async place =>
      query('hourly', 'get', { location: place, units: this.state.units })
    );

    let res = (await Promise.all(promises)).map(r => {
      return {
        data: r.hours[0],
      };
    });

    this.setState({
      places: places.map((place, i) => {
        return { [place]: res[i] };
      }),
      currentLocation: await getStorageKey('current_location'),
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    let savedLocations = await getStorageKey('saved_locations');
    let units = await getStorageKey('units');

    if (prevState.savedLocations !== savedLocations || prevState.units !== units) {
      this.setState({ savedLocations, units });
      this.getVitalData();
    }
  }

  render() {
    const {
      places,
      currentLocation,
      units,
      fabOpen,
      modalVisible,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Locations</Text>
        {places === undefined ? Loading() :
          <List
            style={styles.list}
            dataArray={places}
            keyExtractor={(item, index) => `favLocations${index.toString()}`}
            renderRow={info => {
              if (info === '|Sorry, you have no saved locations yet') {
                return <Text style={styles.noLocations}>{info.substring(1)}</Text>
              }
              let place = Object.keys(info)[0];
              let data = info[place].data;
              return (
                <Card style={styles.card}>
                  <CardItem
                    style={
                      currentLocation === place
                        ? styles.currentCardItem
                        : styles.cardItem
                    }
                    bordered
                    button
                    onPress={async () => {
                      await setStorageKey('current_location', place);
                      this.setState({ currentLocation: place }); // Forces re-render
                      navigation.navigate('WeatherScreen');
                    }}
                    onLongPress={() => this.delete(place)}
                  >
                    <Text style={styles.locationText}>
                      <Feather name='map-pin' size={24} color='white' />
                      {place}
                    </Text>
                    <View style={styles.weatherInformation}>
                      <Text style={styles.locationInfo}>
                        {getIcon('wind')}
                        {`${data.wind_speed}${getUnits(units).wind} ${getWindDirection(data.wind_deg)}`}
                      </Text>
                      <Text style={styles.locationInfo}>
                        {getIcon(data.weather_type)}
                        {` ${data.temp.toFixed(1)}${getUnits(units).temp}`}
                      </Text>
                    </View>
                  </CardItem>
                </Card>
              )
            }}
          />}
        <Fab
          active={fabOpen}
          direction='up'
          style={styles.fab}
          position='bottomRight'
          onPress={() => {
            this.setState({ fabOpen: !fabOpen });
          }}
        >
          <Feather name='edit-3' size={24} color='white' />
          <Button
            style={{ backgroundColor: '#6699CC' }}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Feather name='plus' size={24} color='white' />
          </Button>
        </Fab>
        <Modal
          style={styles.modal}
          isVisible={modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          // Refresh state here or force re-render and componentwillmount
          onSwipeDirection='down'
          onSwipeComplete={() => this.setState({ modalVisible: false })}
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
    height: '100%'
  },
  list: {
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
    margin: 10,
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    height: '20%',
    width: '100%',
  },
  noLocations: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 24
  }
});
