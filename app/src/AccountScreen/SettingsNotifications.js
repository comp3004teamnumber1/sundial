import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Content } from 'native-base';
import Header from '../components/Header';

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		backgroundColor: '#231F29',
	},
	text: {
		color: '#ffffff',
	},
});

export default function SettingsNotifications() {
	return (
		<Container style={styles.container}>
			<StatusBar />
			<Header />
			<Content contentContainerStyle={styles.content}>
				<Text style={styles.text}>Notification Settings</Text>
			</Content>
		</Container>
	);
}
