import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Container, Content, Picker } from 'native-base';
import Header from '../components/Header';
import query from '../util/SundialAPI';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 24,
  },
  container: {
    backgroundColor: '#231F29',
  },
  text: {
    color: '#ffffff',
  },
  header1View: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 12,
    flex: 0,
  },
  header1Text: {
    flex: 0,
    margin: 0,
    color: '#FFFFFF',
    fontSize: 40,
  },
  header2Text: {
    flex: 0,
    margin: 0,
    color: '#FFFFFF',
    fontSize: 20,
  },
  locationTextInput: {
    height: 40,
    borderColor: '#231F29',
    borderWidth: 1,
    paddingLeft: 8,
    color: '#FFFFFF'
  },
  weatherView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 0,
  },
  weatherPicker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    height: 30,
    color: '#FFFFFF',
  },
  durationTextInput: {
    borderColor: '#231F29',
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 12,
  }
  
});

async function submit(location, weather, time){
  const consecDays = await query('consecutive', 'get', { location, weather, time });
  console.log(consecDays);
  // You can do whatever you want to it
}

export default function SettingsCalendar() {
  let [location, setLocation] = useState("Orleans");
  let [weather, setWeather] = useState("Clear");
  let [duration, setDuration] = useState("0");
  return (
    <Container style={styles.container}>
      <StatusBar />
      <Header />
      <Content contentContainerStyle={styles.content}>
        <View style={styles.header1View}>
          <Text style={styles.header1Text}>Calendar Settings</Text>
        </View>
        <Text style={styles.header2Text}>Pick your consecutive days:</Text>
        <TextInput 
          style={styles.locationTextInput}
          placeholder="Location"
          placeholderTextColor='#aaaaaa'
          onChangeText={val => {
            setLocation(val);
          }}
          />
        <Text style={styles.header2Text}>What's your ideal weather?</Text>
        <View style={styles.weatherView}>
          <Picker
            mode='dropdown'
            style={styles.weatherPicker}
            selectedValue={weather}
            onValueChange={setWeather}
          >
            <Picker.Item label='Clear' value='Clear' />
            <Picker.Item label='Clouds' value='Clouds' />
            <Picker.Item label='Rain' value='Rain' />
            <Picker.Item label='Drizzle' value='Drizzle' />
            <Picker.Item label='Snow' value='Snow' />
            <Picker.Item label='Thunderstorm' value='Thunderstorm' />
          </Picker>
        </View>
        <Text style={styles.header2Text}>How many days would you like this weather to last?</Text>
        <TextInput 
          style={styles.durationTextInput}
          keyboardType='numeric'
          onChangeText={val => {
            setDuration(val);
          }}
          value={duration}
          maxLength={10}  //setting limit of input
        />
        <Button
        title="Submit"
        onPress={() => submit(location, weather, duration)}
        />
      </Content>
    </Container>
  );
}
