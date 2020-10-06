import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/HomeScreen';
import CalendarScreen from './src/CalendarScreen';
import WeatherScreen from './src/WeatherScreen';
import AccountScreen from './src/AccountScreen';

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
		};
	}

	async componentDidMount() {
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		});
		this.setState({ isReady: true });
	}

	render() {
		if (!this.state.isReady) {
			return <AppLoading />;
		}

		return (
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let icon;

							if (route.name === 'Home') {
								icon = 'md-home';
							} else if (route.name === 'Calendar') {
								icon = 'md-calendar';
							} else if (route.name === 'Weather') {
								icon = 'md-partly-sunny';
							} else if (route.name === 'Account') {
								icon = 'md-person';
							}

							return <Ionicons name={icon} size={size} color={color} />;
						},
					})}
					tabBarOptions={{
						activeTintColor: '#ffffff',
						inactiveTintColor: '#ffffff',
						activeBackgroundColor: '#000000',
						inactiveBackgroundColor: '#000000',
						showLabel: false,
					}}
				>
					<Tab.Screen name="Home" component={HomeScreen} />
					<Tab.Screen name="Calendar" component={CalendarScreen} />
					<Tab.Screen name="Weather" component={WeatherScreen} />
					<Tab.Screen name="Account" component={AccountScreen} />
				</Tab.Navigator>
			</NavigationContainer>
		);
	}
}
