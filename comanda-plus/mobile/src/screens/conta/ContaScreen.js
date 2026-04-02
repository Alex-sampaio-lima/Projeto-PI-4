// src/screens/conta/ContaScreen.js
// Tela "Minha Conta" — perfil e opções do usuário

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../styles/theme';

// Item de menu reutilizável (interno à tela)
function ItemMenu({ icone, titulo, onPress }) {
  return (
    <TouchableOpacity style={estilos.itemMenu} onPress={onPress} activeOpacity={0.7}>
      <Text style={estilos.itemMenuIcone}>{icone}</Text>
      <Text style={estilos.itemMenuTitulo}>{titulo}</Text>
      <Text style={estilos.setaDireita}>›</Text>
    </TouchableOpacity>
  );
}

function ContaScreen() {
  const navigation = useNavigation();

  function handleSair() {
    if (Platform.OS === 'web') {
      const confirmou = window.confirm('Tem certeza que deseja sair da conta?');
      if (confirmou) {
        const rootNav = navigation.getParent()?.getParent();
        if (rootNav) rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
        else navigation.navigate('Login');
      }
    } else {
      Alert.alert(
        'Sair',
        'Tem certeza que deseja sair da conta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sair',
            style: 'destructive',
            // Acessamos o StackNavigator pai, depois o RootStack pai
            onPress: () => {
              const rootNav = navigation.getParent()?.getParent();
              if (rootNav) {
                rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
              } else {
                // Fallback
                navigation.navigate('Login');
              }
            },
          },
        ]
      );
    }
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={estilos.header}>
        <Text style={estilos.headerTitulo}>Minha Conta</Text>
      </View>

      {/* Perfil */}
      <View style={estilos.perfilContainer}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarIcone}>👤</Text>
        </View>
        <View>
          <Text style={estilos.nomeUsuario}>Usuário</Text>
          <Text style={estilos.emailUsuario}>usuario@email.com</Text>
        </View>
      </View>

      {/* Seção: Pedidos */}
      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>MEUS PEDIDOS</Text>
        <View style={estilos.menuCard}>
          <ItemMenu
            icone="📋"
            titulo="Meus Pedidos"
            onPress={() => Alert.alert('Em breve', 'Histórico de pedidos em desenvolvimento.')}
          />
        </View>
      </View>

      {/* Seção: Configurações */}
      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>CONFIGURAÇÕES</Text>
        <View style={estilos.menuCard}>
          <ItemMenu
            icone="📍"
            titulo="Meus Endereços"
            onPress={() => navigation.navigate('Enderecos')}
          />
          <View style={estilos.divisorMenu} />
          <ItemMenu
            icone="💳"
            titulo="Pagamento"
            onPress={() => Alert.alert('Em breve', 'Formas de pagamento em desenvolvimento.')}
          />
          <View style={estilos.divisorMenu} />
          <ItemMenu
            icone="🔔"
            titulo="Notificações"
            onPress={() => Alert.alert('Em breve', 'Notificações em desenvolvimento.')}
          />
        </View>
      </View>

      {/* Botão sair */}
      <TouchableOpacity style={estilos.botaoSair} onPress={handleSair}>
        <Text style={estilos.textoBotaoSair}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.cores.cinzaClaro },
  header: {
    backgroundColor: theme.cores.primaria,
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
  },
  headerTitulo: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.branco },
  perfilContainer: {
    flexDirection: 'row', alignItems: 'center', gap: theme.espacamento.md,
    backgroundColor: theme.cores.branco, padding: theme.espacamento.md,
    marginBottom: theme.espacamento.md,
  },
  avatar: {
    width: 60, height: 60, borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.primaria, alignItems: 'center', justifyContent: 'center',
  },
  avatarIcone: { fontSize: 28, color: theme.cores.branco },
  nomeUsuario: { fontSize: theme.fonte.tamanho.lg, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro },
  emailUsuario: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  secao: { paddingHorizontal: theme.espacamento.md, marginBottom: theme.espacamento.md },
  secaoTitulo: { fontSize: theme.fonte.tamanho.xs, fontWeight: theme.fonte.peso.bold, color: theme.cores.cinzaTexto, marginBottom: 8, letterSpacing: 0.5 },
  menuCard: { backgroundColor: theme.cores.branco, borderRadius: theme.borda.raio.md, overflow: 'hidden', ...theme.sombra.leve },
  itemMenu: {
    flexDirection: 'row', alignItems: 'center', padding: theme.espacamento.md,
  },
  itemMenuIcone: { fontSize: 20, marginRight: theme.espacamento.md, width: 28 },
  itemMenuTitulo: { flex: 1, fontSize: theme.fonte.tamanho.md, color: theme.cores.textoEscuro },
  setaDireita: { fontSize: 22, color: theme.cores.cinzaTexto },
  divisorMenu: { height: 1, backgroundColor: theme.cores.cinzaClaro, marginLeft: 56 },
  botaoSair: {
    marginHorizontal: theme.espacamento.md, padding: theme.espacamento.md,
    borderRadius: theme.borda.raio.md, backgroundColor: theme.cores.branco,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#E74C3C',
  },
  textoBotaoSair: { color: '#E74C3C', fontWeight: theme.fonte.peso.bold, fontSize: theme.fonte.tamanho.md },
});

export default ContaScreen;
