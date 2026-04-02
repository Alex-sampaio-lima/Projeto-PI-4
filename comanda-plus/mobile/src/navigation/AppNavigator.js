// src/navigation/AppNavigator.js
// Navigator raiz — define entre tela de Login e o app principal

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import StackNavigator from './StackNavigator';

const RootStack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* Tela de autenticação */}
      <RootStack.Screen name="Login" component={LoginScreen} />

      {/* App principal (após login) */}
      <RootStack.Screen name="Main" component={StackNavigator} />
    </RootStack.Navigator>
  );
}

export default AppNavigator;
