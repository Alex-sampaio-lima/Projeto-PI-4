// src/screens/home/RestaurantesScreen.js
// Tela principal que lista os restaurantes (empresas) — Estilo iFood

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { empresasService, categoriasService } from '../../services/endpoints';
import CardRestaurante from '../../components/restaurante/CardRestaurante';
import CategoriaItem from '../../components/produto/CategoriaItem';
import theme from '../../styles/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function RestaurantesScreen() {
  const navigation = useNavigation();
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    carregarEmpresas();
  }, [categoriaSelecionada]);

  async function carregarDadosIniciais() {
    try {
      const respCats = await categoriasService.listar();
      const dadosCats = respCats.data?.dados || respCats.data || [];
      setCategorias(dadosCats);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error.message);
    }
  }

  async function carregarEmpresas() {
    try {
      setCarregando(true);
      const respEmp = await empresasService.listar(categoriaSelecionada?.nome);
      const dadosEmp = respEmp.data?.dados || respEmp.data || [];
      setEmpresas(dadosEmp);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  function handleSelecionarCategoria(cat) {
    if (categoriaSelecionada?.id === cat.id) {
      setCategoriaSelecionada(null);
    } else {
      setCategoriaSelecionada(cat);
    }
  }

  return (
    <View style={estilos.tela}>
      {/* Header Fixo */}
      <View style={[estilos.header, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <View>
          <Text style={estilos.saudacao}>Olá! 👋</Text>
          <Text style={estilos.pergunta}>Qual restaurante hoje?</Text>
        </View>
        <TouchableOpacity
          style={estilos.iconePerfil}
          onPress={() => navigation.navigate('Conta')}
        >
          <Text style={estilos.emojiPerfil}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categorias */}
        <View style={estilos.secaoCategorias}>
          <Text style={estilos.secaoTitulo}>Categorias</Text>
          <FlatList
            data={categorias}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={estilos.listaCategorias}
            renderItem={({ item }) => (
              <CategoriaItem
                categoria={item}
                selecionada={categoriaSelecionada?.id === item.id}
                onPress={() => handleSelecionarCategoria(item)}
              />
            )}
          />
        </View>

        {/* Lista de Restaurantes */}
        <View style={estilos.secaoLojas}>
          <Text style={estilos.secaoTitulo}>Lojas Disponíveis</Text>
          {carregando ? (
            <ActivityIndicator color={theme.cores.primaria} size="large" style={{ marginTop: 40 }} />
          ) : empresas.length > 0 ? (
            empresas.map((emp) => (
              <CardRestaurante
                key={emp.id}
                empresa={emp}
                onPress={() => navigation.navigate('CardapioLoja', { empresa: emp })}
              />
            ))
          ) : (
            <View style={estilos.vazio}>
              <Text style={estilos.textoVazio}>Nenhum restaurante encontrado nesta categoria.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
    backgroundColor: theme.cores.primaria,
  },
  saudacao: {
    fontSize: theme.fonte.tamanho.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  pergunta: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
  },
  iconePerfil: {
    width: 42,
    height: 42,
    borderRadius: theme.borda.raio.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPerfil: { fontSize: 22 },
  secaoCategorias: {
    paddingTop: theme.espacamento.lg,
  },
  secaoTitulo: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    paddingHorizontal: theme.espacamento.md,
    marginBottom: theme.espacamento.sm,
  },
  listaCategorias: {
    paddingHorizontal: theme.espacamento.md,
    paddingBottom: theme.espacamento.md,
  },
  secaoLojas: {
    paddingHorizontal: theme.espacamento.md,
    paddingBottom: theme.espacamento.xl,
  },
  vazio: {
    alignItems: 'center',
    marginTop: 40,
  },
  textoVazio: {
    color: theme.cores.cinzaTexto,
    textAlign: 'center',
  },
});

export default RestaurantesScreen;
