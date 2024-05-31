import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import SaleEntryScreen from '../screens/SaleEntryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Sale-Entry-Screen" component={SaleEntryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;