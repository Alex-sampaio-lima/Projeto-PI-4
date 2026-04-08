import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Botao from '../../components/ui/Botao';
import theme from '../../styles/theme';
import { authService } from '../../services/endpoints';

function CadastroScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      setCarregando(true);
      await authService.cadastrar({ nome, email, senha });
      Alert.alert('Sucesso! 🎉', 'Sua conta foi criada. Faça login para continuar.', [
        { text: 'Fazer login', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const mensagem =
        error?.response?.data?.mensagem || 'Não foi possível criar a conta. Tente novamente.';
      Alert.alert('Erro no cadastro', mensagem);
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
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity style={estilos.btnVoltar} onPress={() => navigation.goBack()}>
            <Text style={estilos.seta}>←</Text>
          </TouchableOpacity>
          <View style={estilos.logoContainer}>
            <Text style={estilos.logoIcone}>🍽️</Text>
          </View>
          <Text style={estilos.titulo}>Crie sua conta</Text>
          <Text style={estilos.subtitulo}>Preencha os dados para se cadastrar</Text>
        </View>

        {/* Formulário */}
        <View style={estilos.formulario}>
          <Text style={estilos.labelInput}>Nome completo</Text>
          <TextInput
            style={estilos.input}
            placeholder="Seu nome"
            placeholderTextColor={theme.cores.cinzaTexto}
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={theme.cores.cinzaTexto}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={estilos.labelInput}>Confirmar senha</Text>
          <TextInput
            style={estilos.input}
            placeholder="Repita a senha"
            placeholderTextColor={theme.cores.cinzaTexto}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <Botao
            titulo="Cadastrar"
            onPress={handleCadastro}
            carregando={carregando}
            estilo={estilos.botao}
          />

          {/* Link para login */}
          <Text style={estilos.textoLink}>
            Já tem conta?{' '}
            <Text style={estilos.link} onPress={() => navigation.goBack()}>
              Fazer login
            </Text>
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
    paddingVertical: theme.espacamento.xl,
    justifyContent: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: theme.espacamento.xl,
    position: 'relative',
  },
  btnVoltar: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: theme.espacamento.sm,
  },
  seta: {
    fontSize: 22,
    color: theme.cores.primaria,
    fontWeight: theme.fonte.peso.bold,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.espacamento.md,
    ...theme.sombra.media,
  },
  logoIcone: {
    fontSize: 30,
  },
  titulo: {
    fontSize: theme.fonte.tamanho.xxl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.primaria,
  },
  subtitulo: {
    fontSize: theme.fonte.tamanho.sm,
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

export default CadastroScreen;
