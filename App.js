import React from 'react';
import {
	ActivityIndicator,
	Text,
	View,
	StatusBar,
	StyleSheet,
	AsyncStorage,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import Registration from './screens/Registration';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
			<Tab.Screen name="LoginScreen" component={LoginScreen} />
				<Tab.Screen name="Registration" component={Registration} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}

const styles= StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  backgroundColor: '#1e90ff',
	},
	
  })