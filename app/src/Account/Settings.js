import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, List, ListItem, Left, Body } from 'native-base';
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

export default function Settings({ navigation }) {
  return (
    <Container style={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <List
        nestedScrollEnabled
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
            style={styles.listItem}
          >
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
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#231F29',
    flex: 1,
    alignItems: 'center',
    padding: 24,
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
  },
});