import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Item, Spinner, Text } from 'native-base';
import { Feather } from '@expo/vector-icons';

export default class AddWeatherLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBadLocation: undefined,
      isLoading: false,
    };
  }

  validateRequest = async () => {
    const config = {
      headers: {
        'Session-Key': key,
      },
    };
  };

  render() {
    const { isLoading, isBadLocation } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
          Add Location (Still WIP)
        </Text>
        {/* <TextInput
          style={styles.textInput}
          onChangeText={(text => this.setState({ text: text }))}
          // onKeyPress={(key => console.log('key', key))}
          value={this.state.text}
          enablesReturnKeyAutomatically={true}
          defaultValue='Please enter a location you want to keep track of'
        /> */}
        <Item>
          <Input
            placeholder='Please enter your location here'
            onChangeText={this.validateRequest}
          />
          {/* Undefined is false */}
          {!isLoading && isBadLocation == false && (
            <Feather name='check-circle' color='#FFFFFF' size={20} />
          )}
          {!isLoading && isBadLocation == true && (
            <Feather name='x-circle' color='#FFFFFF' size={20} />
          )}
          {isLoading && <Spinner color='#FF8C42' size={20} />}
        </Item>

        {isBadLocation && (
          <Text style={styles.description}>
            Sorry, we couldn&apos;t find that location. Please try again.
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
    // backgroundColor: 'white',
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
    color: '#FFFFFF',
    marginTop: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#FF8C42',
    width: '100%',
    borderWidth: 1,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});