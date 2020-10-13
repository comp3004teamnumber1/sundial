import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Content } from 'native-base';
import HourlyView from './WeatherScreen/HourlyView';

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 24,
	},
});

export default function WeatherScreen() {
	return (
		<Container style={{ backgroundColor: '#231F29' }}>
			<StatusBar />
			<Content contentContainerStyle={styles.content}>
				<HourlyView />
			</Content>
		</Container>
	);
}
