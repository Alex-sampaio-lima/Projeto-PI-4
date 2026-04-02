// src/navigation/StackNavigator.js
// Stack Navigator — telas de detalhe e checkout

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DetalheProdutoScreen from '../screens/produtos/DetalheProdutoScreen';
import CheckoutScreen from '../screens/carrinho/CheckoutScreen';
import PedidoFinalizadoScreen from '../screens/pedido/PedidoFinalizadoScreen';
import EnderecosScreen from '../screens/conta/EnderecosScreen';

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Headers customizados em cada tela
      }}
    >
      {/* Telas com tabs */}
      <Stack.Screen name="TabMain" component={TabNavigator} />

      {/* Telas de stack (sem tabs) */}
      <Stack.Screen name="DetalheProduto" component={DetalheProdutoScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="PedidoFinalizado" component={PedidoFinalizadoScreen} />
      <Stack.Screen name="Enderecos" component={EnderecosScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
