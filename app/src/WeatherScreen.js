import React from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { Container, Content } from 'native-base';
import HourlyView from './WeatherScreen/HourlyView';
import WeeklyView from './WeatherScreen/WeeklyView';

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 24,
	},
	container: {
		backgroundColor: '#231F29',
	},
});

export default function WeatherScreen() {
	return (
		<Container style={styles.container}>
			<StatusBar />
			<Content contentContainerStyle={styles.content}>
				<HourlyView />
				<WeeklyView />
			</Content>
		</Container>
	);
}
