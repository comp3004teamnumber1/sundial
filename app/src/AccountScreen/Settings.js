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
});

export default function Settings({ navigation }) {
	return (
		<Container style={styles.container}>
			<StatusBar />
			<Content contentContainerStyle={styles.content}>
				<Text style={styles.title}>Settings</Text>
				<List style={styles.list}>
					<ListItem
						icon
						button
						onPress={() => {
							navigation.navigate('AccountSettings');
						}}
						style={styles.listItem}
					>
						<Left>
							<Feather name="user" size={32} color="white" />
						</Left>
						<Body>
							<Text style={styles.text}>Account</Text>
						</Body>
					</ListItem>
					<ListItem
						icon
						onPress={() => {
							console.log('World');
						}}
						style={styles.listItem}
					>
						<Left>
							<Feather name="cloud" size={32} color="white" />
						</Left>
						<Body>
							<Text style={styles.text}>Weather</Text>
						</Body>
					</ListItem>
				</List>
			</Content>
		</Container>
	);
}
