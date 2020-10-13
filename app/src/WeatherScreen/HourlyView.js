import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, List, Text } from 'native-base';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';

let weather = [
	{
		date: 1602086400,
		temp: {
			c: 21.8,
			f: 71.2,
			k: 295.95,
		},
		weather: 'Clear',
	},
	{
		date: 1602090000,
		temp: {
			c: 21.8,
			f: 71.2,
			k: 295.95,
		},
		weather: 'Clear',
	},
	{
		date: 1602093600,
		temp: {
			c: 21.8,
			f: 71.2,
			k: 295.95,
		},
		weather: 'Clear',
	},
	{
		date: 1602097200,
		temp: {
			c: 21.8,
			f: 71.2,
			k: 295.95,
		},
		weather: 'Clear',
	},
	{
		date: 1602100800,
		temp: {
			c: 21.8,
			f: 71.2,
			k: 295.95,
		},
		weather: 'Clear',
	},
	{
		date: 1602104400,
		temp: {
			c: 21.8,
			f: 71.2,
			k: 295.95,
		},
		weather: 'Clear',
	},
];

const styles = StyleSheet.create({
	container: {
		maxHeight: 220,
		borderColor: '#332E3C',
		borderLeftWidth: 10,
		borderRightWidth: 10,
		borderRadius: 10,
		backgroundColor: '#332E3C',
		zIndex: 1,
	},
	listItem: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#332E3C',
		height: 220,
		width: 85,
		paddingVertical: 18,
		zIndex: 0,
	},
	listItemActive: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FF8C42',
		height: 220,
		width: 85,
		paddingVertical: 18,
		zIndex: 0,
	},
	text: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 18,
	},
	tempPrimary: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 24,
		fontWeight: 'bold',
	},
	tempSecondary: {
		textAlign: 'center',
		color: '#6699CC',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default function HourlyView() {
	const weatherIcon = weather => {
		switch (weather) {
			case 'clear':
			default:
				return <Feather name="sun" size={48} color="white" />;
		}
	};

	const now = moment();

	return (
		<Container style={styles.container}>
			<List
				horizontal={true}
				dataArray={weather}
				showsHorizontalScrollIndicator={false}
				overScrollMode="never"
				renderRow={data => {
					let time = moment.unix(data.date);
					return now.hour() === time.hour() ? (
						<Pressable style={styles.listItemActive} key={data.date}>
							<Text style={styles.text}>{time.format('h A')}</Text>
							{weatherIcon(data.weather)}
							<Text style={styles.tempPrimary}>{data.temp.c + '°'}</Text>
						</Pressable>
					) : (
						<Pressable style={styles.listItem} key={data.date}>
							<Text style={styles.text}>{time.format('h A')}</Text>
							{weatherIcon(data.weather)}
							<Text style={styles.tempPrimary}>{data.temp.c + '°'}</Text>
						</Pressable>
					);
				}}
			/>
		</Container>
	);
}
