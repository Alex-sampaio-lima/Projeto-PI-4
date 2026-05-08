// src/screens/auth/RecuperarSenhaScreen.js
// Tela para redefinir a senha do usuário

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../../components/ui/Botao';
import theme from '../../styles/theme';
import { authService } from '../../services/endpoints';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function RecuperarSenhaScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const insets = useSafeAreaInsets();

  async function handleResetPassword() {
    if (!email || !novaSenha || !confirmarSenha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      setCarregando(true);
      const response = await authService.redefinirSenha({ email, novaSenha });
      
      Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!', [
        { text: 'Ir para o Login', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      const mensagem = error?.response?.data?.mensagem || 'Não foi possível redefinir a senha. Verifique o e-mail informado.';
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        {/* Cabecalho com botão de voltar */}
        <View style={[estilos.cabecalhoFixo, { paddingTop: Math.max(insets.top + 10, 40) }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={theme.cores.textoEscuro} />
          </TouchableOpacity>
        </View>

        <View style={estilos.conteudo}>
          <Text style={estilos.titulo}>Recuperar Senha</Text>
          <Text style={estilos.subtitulo}>Informe seu e-mail cadastrado e a nova senha que deseja usar.</Text>

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

            <Text style={estilos.labelInput}>Nova Senha</Text>
            <TextInput
              style={estilos.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={theme.cores.cinzaTexto}
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />

            <Text style={estilos.labelInput}>Confirmar Nova Senha</Text>
            <TextInput
              style={estilos.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor={theme.cores.cinzaTexto}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <Botao
              titulo="Redefinir Senha"
              onPress={handleResetPassword}
              carregando={carregando}
              estilo={estilos.botao}
            />
          </View>
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
  },
  cabecalhoFixo: {
    paddingHorizontal: theme.espacamento.lg,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.cores.cinzaClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    paddingHorizontal: theme.espacamento.lg,
    paddingTop: theme.espacamento.xl,
  },
  titulo: {
    fontSize: theme.fonte.tamanho.xxl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.cinzaTexto,
    lineHeight: 22,
    marginBottom: theme.espacamento.xl,
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
    marginTop: theme.espacamento.md,
  },
});

export default RecuperarSenhaScreen;
