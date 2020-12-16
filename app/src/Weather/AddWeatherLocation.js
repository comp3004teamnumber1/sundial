import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Item, Spinner, Text } from 'native-base';
import { Feather } from '@expo/vector-icons';
import query from './../util/SundialAPI';
import { getSettings, setStorageKey } from '../util/Storage';

export default class AddWeatherLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBadLocation: undefined,
      isDuplicateLocation: undefined,
      isLoading: false,
      input: ''
    };
  }

  validateRequest = async location => {
    this.setState({ isLoading: true });
    // const settings = await getSettings();
    // const { units } = settings;
    const { saved_locations, setSavedLocations, units } = this.props;
    console.log('AddWeatherLoc\'s saved_location props are:', this.props.saved_locations);
    let res = await query('hourly', 'get', { location, units: units.toLowerCase() });
    if (res.hours === undefined) {
      this.setState({ isBadLocation: true, isLoading: false, input: '' });
      console.log('a bad location!');
      console.log(location);
      console.log(res);
      return;
    }

    if (saved_locations === '') {
      this.setState({ isBadLocation: false, isDuplicateLocation: false, isLoading: false, input: '' });
      // await setStorageKey('settings', JSON.stringify({ ...settings, saved_locations: `{"${location}":null}` }));
      setSavedLocations(`{"${location}":null}`);
      return;
    }
    let locations = saved_locations.split('|')
      .map(place => JSON.parse(place))
      .map(json => Object.keys(json)[0]);

    if (locations.includes(location)) {
      this.setState({ isDuplicateLocation: true, isLoading: false, input: '' });
      return;
    }

    this.setState({ isBadLocation: false, isDuplicateLocation: false, isLoading: false, input: '' });
    // await setStorageKey('settings', JSON.stringify({ ...settings, saved_locations: `${saved_locations}|{"${location}":null}` }));
    setSavedLocations(`${saved_locations}|{"${location}":null}`);
  };

  render() {
    const { isLoading, isBadLocation, isDuplicateLocation, input } = this.state;
    let descriptionColor = isBadLocation || isDuplicateLocation ? 'red' : 'green';
    return (
      <View style={styles.container}>
        <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
          Add Location
        </Text>
        <Item>
          <Input
            style={styles.textInput}
            value={input}
            autoFocus
            placeholder='Please enter your location here'
            onSubmitEditing={(event) => (this.validateRequest(event.nativeEvent.text))}
            onChangeText={e => { this.setState({ input: e.replace('|', '') }) }}
          />
          {/* Undefined is false */}
          {!isLoading && (isBadLocation == false && isDuplicateLocation == false) && (
            <Feather name='check-circle' color='green' size={20} />
          )}
          {!isLoading && (isBadLocation == true || isDuplicateLocation == true) && (
            <Feather name='x-circle' color='red' size={20} />
          )}
          {isLoading && <Spinner color='#FF8C42' size={20} />}
        </Item>

        <Text style={{ ...styles.description, color: descriptionColor }}>
          {isBadLocation && 'Sorry, we couldn\'t find that location. Please try again.'}
          {isDuplicateLocation && 'It looks like this location has already been saved.'}
          {isBadLocation == false && isDuplicateLocation == false && 'Location added successfully!'}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
  },
  textInput: {
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
