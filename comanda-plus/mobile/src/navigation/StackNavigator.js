import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import DetalheProdutoScreen from '../screens/produtos/DetalheProdutoScreen';
import CheckoutScreen from '../screens/carrinho/CheckoutScreen';
import PedidoFinalizadoScreen from '../screens/pedido/PedidoFinalizadoScreen';
import EnderecosScreen from '../screens/conta/EnderecosScreen';
import PagamentosScreen from '../screens/conta/PagamentosScreen';
import MeusPedidosScreen from '../screens/pedido/MeusPedidosScreen';
import theme from '../styles/theme';

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Headers customizados em cada tela
        headerBackTitleVisible: false, // Oculta o texto "TabMain" no botão voltar (iOS)
        headerBackTitle: 'Voltar', // Texto de fallback caso esteja visível
      }}
    >
      {/* Telas com tabs */}
      <Stack.Screen name="TabMain" component={TabNavigator} />
      <Stack.Screen name="DetalheProduto" component={DetalheProdutoScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="PedidoFinalizado" component={PedidoFinalizadoScreen} />
      <Stack.Screen name="Enderecos" component={EnderecosScreen} />
      <Stack.Screen name="Pagamentos" component={PagamentosScreen} />
      <Stack.Screen name="MeusPedidos" component={MeusPedidosScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
