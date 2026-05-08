// src/screens/produtos/ProdutosScreen.js
// Tela de listagem de produtos com filtro por categoria e busca

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardProduto from '../../components/produto/CardProduto';
import CategoriaItem from '../../components/produto/CategoriaItem';
import { produtosService, categoriasService } from '../../services/endpoints';
import { useCart } from '../../hooks/useCart';
import theme from '../../styles/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ProdutosScreen() {
  const navigation = useNavigation();
  const { adicionarAoCarrinho, adicionandoIds } = useCart();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    carregarProdutos(categoriaSelecionada);
  }, [categoriaSelecionada]);

  async function carregarDados() {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        produtosService.listar(),
        categoriasService.listar(),
      ]);
      const dadosProdutos = resProdutos.data?.dados || resProdutos.data || [];
      const dadosCategorias = resCategorias.data?.dados || resCategorias.data || [];
      setProdutos(Array.isArray(dadosProdutos) ? dadosProdutos : []);
      setCategorias(Array.isArray(dadosCategorias) ? dadosCategorias : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarProdutos(categoriaId) {
    try {
      const filtros = categoriaId ? { category_id: categoriaId } : {};
      const resposta = await produtosService.listar(filtros);
      const dados = resposta.data?.dados || resposta.data || [];
      setProdutos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao filtrar produtos:', error.message);
    }
  }

  async function handleAdicionar(produto) {
    try {
      await adicionarAoCarrinho(produto);
    } catch (e) {
      // O erro já é alertado no context
    }
  }

  // Filtra os produtos pela busca de texto
  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <View style={[estilos.header, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <Text style={estilos.headerTitulo}>Cardápio</Text>

        {/* Campo de busca */}
        <View style={estilos.campoBusca}>
          <Text style={estilos.iconeBusca}>🔍</Text>
          <TextInput
            style={estilos.inputBusca}
            placeholder="Buscar produto..."
            placeholderTextColor={theme.cores.cinzaTexto}
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>

      {/* Filtro de categorias (scroll horizontal) */}
      <View style={estilos.filtroContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.filtroScroll}>
          {/* Opção "Todos" */}
          <CategoriaItem
            categoria={{ id: null, nome: 'Todos', icone: '🍽️' }}
            selecionado={categoriaSelecionada === null}
            onPress={() => setCategoriaSelecionada(null)}
          />
          {categorias.map((cat) => (
            <CategoriaItem
              key={cat.id}
              categoria={cat}
              selecionado={categoriaSelecionada === cat.id}
              onPress={() => setCategoriaSelecionada(
                categoriaSelecionada === cat.id ? null : cat.id
              )}
            />
          ))}
        </ScrollView>
      </View>

      {/* Lista de produtos */}
      {carregando ? (
        <ActivityIndicator color={theme.cores.primaria} size="large" style={estilos.loader} />
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CardProduto
              produto={item}
              onPress={() => navigation.navigate('DetalheProduto', { produto: item })}
              onAdicionar={() => handleAdicionar(item)}
              carregando={adicionandoIds.includes(item.id)}
            />
          )}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <Text style={estilos.semResultados}>Nenhum produto encontrado.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
  },
  header: {
    backgroundColor: theme.cores.primaria,
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
  },
  headerTitulo: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
    marginBottom: theme.espacamento.sm,
  },
  campoBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    paddingHorizontal: theme.espacamento.sm,
  },
  iconeBusca: { fontSize: 16, marginRight: 6 },
  inputBusca: {
    flex: 1,
    paddingVertical: 10,
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.textoEscuro,
  },
  filtroContainer: {
    backgroundColor: theme.cores.branco,
    paddingVertical: theme.espacamento.sm,
    ...theme.sombra.leve,
  },
  filtroScroll: {
    paddingHorizontal: theme.espacamento.md,
  },
  lista: {
    padding: theme.espacamento.md,
  },
  loader: {
    marginTop: theme.espacamento.xxl,
  },
  semResultados: {
    textAlign: 'center',
    color: theme.cores.cinzaTexto,
    fontSize: theme.fonte.tamanho.md,
    marginTop: theme.espacamento.xxl,
  },
});

export default ProdutosScreen;
