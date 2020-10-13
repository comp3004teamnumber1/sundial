import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './AccountScreen/Settings';
import SettingsAccount from './AccountScreen/SettingsAccount';
import SettingsCalendar from './AccountScreen/SettingsCalendar';
import SettingsHelp from './AccountScreen/SettingsHelp';
import SettingsWeather from './AccountScreen/SettingsWeather';
import SettingsNotifications from './AccountScreen/SettingsNotifications';

const AccountStack = createStackNavigator();

export default function AccountScreen() {
	return (
		<AccountStack.Navigator
			initialRouteName="Settings"
			screenOptions={{ headerShown: false }}
		>
			<AccountStack.Screen name="Settings" component={Settings} />
			<AccountStack.Screen name="SettingsAccount" component={SettingsAccount} />
			<AccountStack.Screen
				name="SettingsCalendar"
				component={SettingsCalendar}
			/>
			<AccountStack.Screen name="SettingsHelp" component={SettingsHelp} />
			<AccountStack.Screen
				name="SettingsNotifications"
				component={SettingsNotifications}
			/>
			<AccountStack.Screen name="SettingsWeather" component={SettingsWeather} />
		</AccountStack.Navigator>
	);
}
