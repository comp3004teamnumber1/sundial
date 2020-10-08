import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Content } from 'native-base';

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default function CalendarScreen() {
	return (
		<Container>
			<StatusBar />
			<Content contentContainerStyle={styles.content}>
				<Text>Welcome to Calendar</Text>
			</Content>
		</Container>
	);
}
