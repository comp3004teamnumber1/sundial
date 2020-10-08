import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container, Header, Content, Card, CardItem, Body, Text } from 'native-base';
import { color } from 'react-native-reanimated';

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    margin: 'auto',
    width: '90%',
    // color: '#332E3C'
  },
  Weekdays: {
    flex: 1,
    height: '200%',
    backgroundColor: '#332E3C',
    // marginLeft: '10%'
    color: '#FFFAFA'
  }
});

export default function WeeklyView(props) {
  let today = new Date().getDay();
  //The index in .map() below doesn't align with js Date.getDay(), so finding 'today' is a little complicated with modulus
  let weekdays = props.week.map((day, i) =>
    <Weekday
      key={day}
      day={day}
      today={today === ((i + 1) % 6)}
      style={styles.Weekdays}
    />);
  return (
    <Container>
      <Text>
        Weekly Weather
      </Text>
      <ScrollView horizontal={true} style={styles.Container}>
        {weekdays}
      </ScrollView>
    </Container>
  );
}

function Weekday(props) {
  return (
    <Container horizontal={true}>
      <Card>
        <CardItem style={styles.Weekdays}>
          <Body>
            {
              props.today &&
              <Text style={{ color: '#FFFAFA' }}>
                {'haha'}
              </Text>
            }
          </Body>
        </CardItem>
        <CardItem footer style={styles.Weekdays}>
          <Text style={{ color: '#FFFAFA' }}>
            {props.day}
          </Text>
        </CardItem>
      </Card>
    </Container >
  );
}