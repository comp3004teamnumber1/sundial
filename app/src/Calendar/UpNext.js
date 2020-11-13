import React from 'react';
import { Container } from 'native-base';
import moment from 'moment';
import { SafeAreaView, FlatList, StyleSheet, View, Text } from 'react-native';
import { getIcon } from '../util/Util';

const Item = ({ task }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.task}>{task.task}</Text>
      <View
        style={[
          styles.weather,
          {
            transform: [{ scale: 0.5 }],
          },
        ]}
      >
        {getIcon(task.ideal_weather)}
      </View>
      <Text style={styles.date}>{displayTime(task.date)}</Text>
    </View>
  );
};

function displayTime(date) {
  let time = moment.unix(date);
  return time.format('M/D [\n] h A');
}

export default function UpNext({ data }) {
  const renderItem = ({ item }) => <Item task={item} />;
  if (data.length < 1) {
    return (
      <SafeAreaView style={styles.container}>
        <Container style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>
            There are currently no upcoming tasks
          </Text>
        </Container>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `Task${index.toString()}`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 220,
    borderColor: '#332E3C',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderRadius: 10,
    backgroundColor: '#332E3C',
    zIndex: 1,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    flex: 1,
    height: 60,
  },
  task: {
    color: '#FFFFFF',
    fontSize: 25,
    width: 180,
  },
  date: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  noTasksContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#332E3C',
  },
  noTasksText: {
    color: '#CDCDCD',
    fontSize: 20,
    textAlign: 'center',
  },
});
