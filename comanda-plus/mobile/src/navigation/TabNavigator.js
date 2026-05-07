// src/navigation/TabNavigator.js
// Bottom Tab Navigator — abas principais do app

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestaurantesScreen from '../screens/home/RestaurantesScreen';
import ProdutosScreen from '../screens/produtos/ProdutosScreen';
import CarrinhoScreen from '../screens/carrinho/CarrinhoScreen';
import ContaScreen from '../screens/conta/ContaScreen';
import { useCart } from '../hooks/useCart';
import theme from '../styles/theme';

const Tab = createBottomTabNavigator();

// Ícones de cada aba
const ICONES = {
  Inicio: { normal: '🏠', focado: '🏠' },
  Produtos: { normal: '🍽️', focado: '🍽️' },
  Carrinho: { normal: '🛒', focado: '🛒' },
  Conta: { normal: '👤', focado: '👤' },
};

function TabNavigator() {
  const { quantidadeTotalItens } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.cores.primaria,
        tabBarInactiveTintColor: theme.cores.cinzaTexto,
        tabBarStyle: estilos.tabBar,
        tabBarLabelStyle: estilos.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          const icones = ICONES[route.name];
          const icone = focused ? icones.focado : icones.normal;

          // Badge no carrinho
          if (route.name === 'Carrinho' && quantidadeTotalItens > 0) {
            return (
              <View>
                <Text style={{ fontSize: 22 }}>{icone}</Text>
                <View style={estilos.badge}>
                  <Text style={estilos.badgeTexto}>{quantidadeTotalItens}</Text>
                </View>
              </View>
            );
          }

          return <Text style={{ fontSize: 22 }}>{icone}</Text>;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={RestaurantesScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Produtos" component={ProdutosScreen} options={{ tabBarLabel: 'Cardápio' }} />
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} options={{ tabBarLabel: 'Carrinho' }} />
      <Tab.Screen name="Conta" component={ContaScreen} options={{ tabBarLabel: 'Conta' }} />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.cores.branco,
    borderTopWidth: 1,
    borderTopColor: theme.cores.cinzaMedio,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    ...theme.sombra.media,
  },
  tabBarLabel: {
    fontSize: theme.fonte.tamanho.xs,
    fontWeight: theme.fonte.peso.semibold,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: theme.cores.destaque,
    borderRadius: theme.borda.raio.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTexto: {
    color: theme.cores.branco,
    fontSize: 10,
    fontWeight: theme.fonte.peso.bold,
  },
});

export default TabNavigator;
