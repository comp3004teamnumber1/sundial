import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button, Card, CardItem, Fab, List, Text, View } from 'native-base';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { setStorageKey, getStorageKey, getSettings } from '../util/Storage';
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
      saved_locations: '',
      units: '',
      fabOpen: false,
      modalVisible: false,
    };
    this.setSavedLocations = this.setSavedLocations.bind(this);
  }

  async componentDidMount() {
    console.log('COMPONENTDIDMOUNT IS BEING CALLED ==================');
    this.setState({ saved_locations: (await getSettings()).saved_locations });
    const { navigation } = this.props;
    navigation.addListener('focus', async () => {
      await this.getVitalData();
    });
    this.getVitalData();
  }

  async getVitalData() {
    console.log('GETVITALDATA IS BEING CALLED ================');
    // const { saved_locations, units } = await getSettings();
    const settings = await getSettings();
    console.log('settings in getvitaldata', settings);
    const { units } = settings;
    const { saved_locations } = this.state;
    console.log('Settings saved_locations is:', saved_locations);
    console.log('WeatherNavigation\'s saved_locations is:', saved_locations);

    let places = saved_locations ? saved_locations.split('|') : undefined;
    if (!places) {
      this.setState({ places: ['|Sorry, you have no saved locations yet'] })
      return;
    }

    places = places.map(place => Object.keys(JSON.parse(place))[0]);

    let promises = places.map(async place =>
      query('hourly', 'get', { location: place, units })
    );
    let res = (await Promise.all(promises)).map(r => {
      return {
        data: r.hours[0],
      };
    });

    const updatedSettings = { ...settings, saved_locations: saved_locations };
    console.log('updated settings in weather nav!', updatedSettings);
    await setStorageKey('settings', JSON.stringify(updatedSettings));

    query('/settings', 'post', { settings: JSON.stringify(updatedSettings) });

    this.setState({
      places: places.map((place, i) => {
        return { [place]: res[i] };
      }),
      currentLocation: await getStorageKey('current_location'),
      saved_locations,
      units
    });
  }

  async delete(location) {
    // Although using state is faster, the source of truth for saved_locations comes from async storage
    // const settings = await getSettings();
    const { saved_locations } = this.state;
    let locations = saved_locations.split('|')
      .map(place => JSON.parse(place))
      .map(json => Object.keys(json)[0]);

    let updatedLocationsInStringJSON = locations.filter(loc => loc !== location)
      .map(loc => `{"${loc}":null}`)
      .join('|');

    console.log('WeatherNav is deleting ', location, ' new saved_locations is:', updatedLocationsInStringJSON);
    // await setStorageKey('settings', JSON.stringify({ ...(await getSettings()), saved_locations: updatedLocationsInStringJSON }));
    this.setState({ saved_locations: updatedLocationsInStringJSON })
    this.getVitalData();
  }

  setSavedLocations(saved_locations) {
    console.log('WeatherNav is being updated by AddWeatherLoc!');
    console.log(saved_locations, '\n');
    this.setState({ saved_locations: saved_locations });
    console.log('WeatherNav State:', { ...this.state, places: Object.keys(this.state.places[0])[0] });
    this.getVitalData();
  }

  render() {
    const {
      places,
      currentLocation,
      units,
      fabOpen,
      modalVisible,
      saved_locations
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
                    onLongPress={() =>
                      Alert.alert(
                        'Delete Saved Location',
                        'Are you sure you want to delete this location?',
                        [
                          {
                            text: 'No',
                            style: 'cancel',
                          },
                          {
                            text: 'Yes',
                            onPress: () => {
                              this.delete(place);
                            },
                          },
                        ]
                      )
                    }
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
          <AddWeatherLocation saved_locations={saved_locations} units={units} setSavedLocations={this.setSavedLocations} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
    height: '100%'
  },
  list: {
    backgroundColor: '#231F29',
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
