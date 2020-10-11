import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './AccountScreen/Settings';
import AccountSettings from './AccountScreen/AccountSettings';

const AccountStack = createStackNavigator();

export default function AccountScreen() {
	return (
		<AccountStack.Navigator
			initialRouteName="Settings"
			screenOptions={{ headerShown: false }}
		>
			<AccountStack.Screen name="Settings" component={Settings} />
			<AccountStack.Screen name="AccountSettings" component={AccountSettings} />
		</AccountStack.Navigator>
	);
}
