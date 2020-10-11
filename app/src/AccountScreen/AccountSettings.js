import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Content } from 'native-base';
import Header from './../components/Header';

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default function AccountSettings() {
	return (
		<Container>
			<Header />
			<Content contentContainerStyle={styles.content}>
				<Text>Temporary</Text>
			</Content>
		</Container>
	);
}
