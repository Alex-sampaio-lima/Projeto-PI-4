// src/screens/auth/LoginScreen.js
// Tela de login — baseada no design do Figma

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  Image, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Botao from '../../components/ui/Botao';
import theme from '../../styles/theme';

function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Simulação de login (substituir por autenticação real futuramente)
  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);
    // Simula uma chamada de API com delay
    setTimeout(() => {
      setCarregando(false);
      // Navega para o app principal após "login"
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }, 1000);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo e título */}
        <View style={estilos.cabecalho}>
          <View style={estilos.logoContainer}>
            <Text style={estilos.logoIcone}>🍽️</Text>
          </View>
          <Text style={estilos.titulo}>Comanda+</Text>
          <Text style={estilos.subtitulo}>Seu app de pedidos</Text>
        </View>

        {/* Formulário */}
        <View style={estilos.formulario}>
          <Text style={estilos.labelInput}>Email</Text>
          <TextInput
            style={estilos.input}
            placeholder="seu@email.com"
            placeholderTextColor={theme.cores.cinzaTexto}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={estilos.labelInput}>Senha</Text>
          <TextInput
            style={estilos.input}
            placeholder="••••••••"
            placeholderTextColor={theme.cores.cinzaTexto}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Botao
            titulo="Log In"
            onPress={handleLogin}
            carregando={carregando}
            estilo={estilos.botao}
          />

          {/* Link de cadastro */}
          <Text style={estilos.textoLink}>
            Não tem conta?{' '}
            <Text style={estilos.link}>Cadastre-se</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.branco,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.espacamento.lg,
    paddingVertical: theme.espacamento.xxl,
    justifyContent: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: theme.espacamento.xxl,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.espacamento.md,
    ...theme.sombra.media,
  },
  logoIcone: {
    fontSize: 40,
  },
  titulo: {
    fontSize: theme.fonte.tamanho.xxxl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.primaria,
  },
  subtitulo: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.cinzaTexto,
    marginTop: 4,
  },
  formulario: {
    width: '100%',
  },
  labelInput: {
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.cores.cinzaClaro,
    borderWidth: 1,
    borderColor: theme.cores.cinzaMedio,
    borderRadius: theme.borda.raio.md,
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: 14,
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.md,
  },
  botao: {
    marginTop: theme.espacamento.sm,
    width: '100%',
  },
  textoLink: {
    textAlign: 'center',
    marginTop: theme.espacamento.lg,
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
  },
  link: {
    color: theme.cores.primaria,
    fontWeight: theme.fonte.peso.bold,
  },
});

export default LoginScreen;
