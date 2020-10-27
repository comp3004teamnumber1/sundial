import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  Container,
  Text,
  Content,
  List,
  ListItem,
  Left,
  Body,
} from 'native-base';
import { Feather } from '@expo/vector-icons';

const options = [
  {
    icon: 'user',
    dest: 'SettingsAccount',
    label: 'Account',
  },
  {
    icon: 'cloud',
    dest: 'SettingsWeather',
    label: 'Weather',
  },
  {
    icon: 'calendar',
    dest: 'SettingsCalendar',
    label: 'Calendar',
  },
  {
    icon: 'bell',
    dest: 'SettingsNotifications',
    label: 'Notifications',
  },
  {
    icon: 'help-circle',
    dest: 'SettingsHelp',
    label: 'Help',
  },
];

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
  },
  container: {
    backgroundColor: '#231F29',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
  },
  list: {
    margin: 24,
    width: '100%',
  },
  listItem: {
    marginVertical: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
  },
  footerText: {
    color: '#332E3C',
    margin: 24,
  },
});

export default function Settings({ navigation }) {
  return (
    <Container style={styles.container}>
      <StatusBar />
      <Content contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <List
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          dataArray={options}
          renderRow={data => (
            <ListItem
              icon
              button
              onPress={() => {
                navigation.navigate(data.dest);
              }}
              style={styles.listItem}>
              <Left>
                <Feather name={data.icon} size={32} color='white' />
              </Left>
              <Body>
                <Text style={styles.text}>{data.label}</Text>
              </Body>
            </ListItem>
          )}
        />
        <Text style={styles.footerText}>Developed by comp3004teamnumber1</Text>
      </Content>
    </Container>
  );
}
