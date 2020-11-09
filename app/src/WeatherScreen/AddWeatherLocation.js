import React, { Component } from 'react';
import { Pressable, StatusBar, StyleSheet, View, ScrollView, LogBox } from 'react-native';
import { Container, Header, Text, Content } from 'native-base';

export default function AddWeatherLocation() {
  return (
    <Container style={styles.container}>
      <Text style={styles.temp}>
        WIP
      </Text>
    </Container>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: '#231F29',
    },
    temp: {
      color: '#FFFFFF',
      fontSize: 48
    }
  }
)