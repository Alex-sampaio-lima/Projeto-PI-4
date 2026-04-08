// src/navigation/AppNavigator.js
// Navigator raiz — define entre tela de Login e o app principal

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import CadastroScreen from '../screens/auth/CadastroScreen';
import RecuperarSenhaScreen from '../screens/auth/RecuperarSenhaScreen';
import StackNavigator from './StackNavigator';

const RootStack = createStackNavigator();

function AppNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* Telas de autenticação */}
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Cadastro" component={CadastroScreen} />
      <RootStack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />

      {/* App principal (após login) */}
      <RootStack.Screen name="Main" component={StackNavigator} />
    </RootStack.Navigator>
  );
}

export default AppNavigator;
