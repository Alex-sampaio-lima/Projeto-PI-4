// App.js — Ponto de entrada do aplicativo Comanda+

// IMPORTANTE: react-native-gesture-handler DEVE ser o primeiro import
import 'react-native-gesture-handler';

import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';

import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';

// Desabilita react-native-screens na web para evitar tela branca
// Na web, o fallback do React Navigation (Views simples) funciona perfeitamente
enableScreens(Platform.OS !== 'web');

export default function App() {
  return (
    // GestureHandlerRootView é necessário para o React Navigation Stack funcionar corretamente
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* CartProvider — disponibiliza o estado do carrinho para todo o app */}
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
