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

import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';

// Desabilita react-native-screens na web para evitar tela branca
// Na web, o fallback do React Navigation (Views simples) funciona perfeitamente
enableScreens(Platform.OS !== 'web');

function App() {
  return (
    // No ambiente Web, o flex: 1 no nível raiz precisa ser garantido
    <GestureHandlerRootView style={{ flex: 1, minHeight: '100%' }}>
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

// Registra o componente raiz para que o Expo saiba o que carregar
// Isso é obrigatório se o arquivo "main" no package.json for App.js
registerRootComponent(App);

export default App;
