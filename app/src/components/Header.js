import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Content } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
	container: {
		flex: 0.08,
		backgroundColor: '#000000',
		justifyContent: 'center',
		paddingLeft: 18,
	},
});

export default function Header() {
	const navigation = useNavigation();

	return (
		<Container style={styles.container}>
			<Feather
				name="arrow-left"
				size={24}
				color="white"
				onPress={() => {
					navigation.goBack();
				}}
			/>
		</Container>
	);
}
