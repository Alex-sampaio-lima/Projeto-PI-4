// src/screens/conta/EnderecosScreen.js
// Tela de gerenciamento de endereços

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, Platform, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Botao from '../../components/ui/Botao';
import { enderecosService } from '../../services/endpoints';
import theme from '../../styles/theme';

function EnderecosScreen() {
  const navigation = useNavigation();
  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Campos do formulário
  const [form, setForm] = useState({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' });

  useEffect(() => {
    carregarEnderecos();
  }, []);

  async function carregarEnderecos() {
    try {
      const resposta = await enderecosService.listar();
      const dados = resposta.data?.dados || resposta.data || [];
      setEnderecos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar() {
    const { rua, numero, bairro, cidade, estado, cep } = form;
    if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
      if (Platform.OS === 'web') {
        window.alert('Atenção: Preencha todos os campos obrigatórios.');
      } else {
        Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      }
      return;
    }

    setSalvando(true);
    try {
      await enderecosService.criar(form);
      setModalVisivel(false);
      setForm({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' });
      await carregarEnderecos();
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') window.alert(`Erro: Não foi possível salvar o endereço. ${error.message}`);
      else Alert.alert('Erro', 'Não foi possível salvar o endereço.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleRemover(id) {
    if (Platform.OS === 'web') {
      const confirmou = window.confirm('Tem certeza que deseja remover este endereço?');
      if (confirmou) {
        try {
          await enderecosService.remover(id);
          await carregarEnderecos();
        } catch (error) {
          console.error(error);
          window.alert(`Não foi possível remover. Motivo: ${error.message}`);
        }
      }
    } else {
      Alert.alert(
        'Remover Endereço',
        'Tem certeza que deseja remover este endereço?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                await enderecosService.remover(id);
                await carregarEnderecos();
              } catch (error) {
                console.error(error);
                Alert.alert('Erro', `Não foi possível remover. Motivo: ${error.message}`);
              }
            },
          },
        ]
      );
    }
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <View style={estilos.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
          <Text style={estilos.setaVoltar}>←</Text>
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Meus Endereços</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Lista de endereços */}
      {carregando ? (
        <ActivityIndicator color={theme.cores.primaria} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={enderecos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={estilos.enderecoCard}>
              <Text style={estilos.iconePin}>📍</Text>
              <View style={estilos.enderecoInfo}>
                <Text style={estilos.rua}>{item.rua}, {item.numero}</Text>
                {item.complemento ? <Text style={estilos.complemento}>{item.complemento}</Text> : null}
                <Text style={estilos.cidade}>{item.bairro}, {item.cidade}/{item.estado}</Text>
                <Text style={estilos.cep}>CEP: {item.cep}</Text>
                {item.principal ? <Text style={estilos.principal}>⭐ Principal</Text> : null}
              </View>
              <TouchableOpacity onPress={() => handleRemover(item.id)}>
                <Text style={estilos.botaoRemover}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <View style={estilos.vazio}>
              <Text style={estilos.emojiVazio}>📭</Text>
              <Text style={estilos.textoVazio}>Nenhum endereço cadastrado</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botão adicionar */}
      <View style={estilos.footer}>
        <Botao titulo="+ Adicionar Endereço" onPress={() => setModalVisivel(true)} estilo={estilos.botaoAdicionar} />
      </View>

      {/* Modal para adicionar endereço */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modal}>
            <Text style={estilos.modalTitulo}>Novo Endereço</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {[
                ['Rua / Avenida', 'rua', 'Rua das Flores'],
                ['Número', 'numero', '123'],
                ['Complemento (opcional)', 'complemento', 'Apto 4B'],
                ['Bairro', 'bairro', 'Centro'],
                ['Cidade', 'cidade', 'São Paulo'],
                ['Estado (UF)', 'estado', 'SP'],
                ['CEP', 'cep', '01310-100'],
              ].map(([label, campo, placeholder]) => (
                <View key={campo}>
                  <Text style={estilos.labelModal}>{label}</Text>
                  <TextInput
                    style={estilos.inputModal}
                    placeholder={placeholder}
                    placeholderTextColor={theme.cores.cinzaTexto}
                    value={form[campo]}
                    onChangeText={(val) => setForm({ ...form, [campo]: val })}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={estilos.modalBotoes}>
              <Botao titulo="Cancelar" variante="secundario" onPress={() => setModalVisivel(false)} estilo={estilos.botaoModal} />
              <Botao titulo="Salvar" onPress={handleSalvar} carregando={salvando} estilo={estilos.botaoModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.cores.cinzaClaro },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.cores.primaria,
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
  },
  botaoVoltar: { width: 40 },
  setaVoltar: { color: theme.cores.branco, fontSize: 22, fontWeight: 'bold' },
  headerTitulo: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.branco },
  lista: { padding: theme.espacamento.md },
  enderecoCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: theme.cores.branco, borderRadius: theme.borda.raio.md,
    padding: theme.espacamento.md, marginBottom: theme.espacamento.sm, ...theme.sombra.leve,
  },
  iconePin: { fontSize: 22, marginRight: theme.espacamento.sm, marginTop: 2 },
  enderecoInfo: { flex: 1 },
  rua: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.semibold, color: theme.cores.textoEscuro },
  complemento: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  cidade: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto, marginTop: 2 },
  cep: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.cinzaTexto },
  principal: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.primaria, fontWeight: theme.fonte.peso.bold, marginTop: 4 },
  botaoRemover: { fontSize: 20, padding: 4 },
  vazio: { alignItems: 'center', paddingTop: theme.espacamento.xxl },
  emojiVazio: { fontSize: 48, marginBottom: theme.espacamento.sm },
  textoVazio: { fontSize: theme.fonte.tamanho.md, color: theme.cores.cinzaTexto },
  footer: { backgroundColor: theme.cores.branco, padding: theme.espacamento.md, borderTopWidth: 1, borderTopColor: theme.cores.cinzaMedio },
  botaoAdicionar: { width: '100%' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: theme.cores.overlay, justifyContent: 'flex-end' },
  modal: {
    backgroundColor: theme.cores.branco, borderTopLeftRadius: theme.borda.raio.xl,
    borderTopRightRadius: theme.borda.raio.xl, padding: theme.espacamento.lg,
    maxHeight: '90%',
  },
  modalTitulo: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro, marginBottom: theme.espacamento.md },
  labelModal: { fontSize: theme.fonte.tamanho.sm, fontWeight: theme.fonte.peso.semibold, color: theme.cores.textoEscuro, marginBottom: 4 },
  inputModal: {
    backgroundColor: theme.cores.cinzaClaro, borderWidth: 1, borderColor: theme.cores.cinzaMedio,
    borderRadius: theme.borda.raio.md, paddingHorizontal: theme.espacamento.md,
    paddingVertical: 10, fontSize: theme.fonte.tamanho.md, color: theme.cores.textoEscuro, marginBottom: theme.espacamento.sm,
  },
  modalBotoes: { flexDirection: 'row', gap: theme.espacamento.sm, marginTop: theme.espacamento.sm },
  botaoModal: { flex: 1 },
});

export default EnderecosScreen;
