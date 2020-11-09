import React from 'react';
import moment from 'moment';
import { SafeAreaView, FlatList, StyleSheet, View, Text } from "react-native";
import { icon } from '../components/constants.js';

const Item = ({ task }) => {
    return (
    <View style={styles.item}>
        <Text style={styles.task}>{task.task}</Text>
        <View style={[styles.weather, {
            transform: [{ scale: 0.5 }]
        }]}>
            {icon(task.ideal_weather)}
        </View>
        <Text style={styles.date}>{displayTime(task.date)}</Text>
    </View>
)};

function displayTime(date) {
    let time = moment.unix(date);
    return time.format('M/D [\n] h A');
}

export default function UpNext({ data }) {

    const renderItem = ({ item }) => (
        <Item task={item} />
    )
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
        height: 60
    },
    task: {
        color: "#FFFFFF",
        fontSize: 25,
        width: 180
    },
    date: {
        color: "#FFFFFF",
        fontSize: 15,
    },
    weather: {
    }
});