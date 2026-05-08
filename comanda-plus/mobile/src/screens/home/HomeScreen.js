// src/screens/home/HomeScreen.js
// Tela inicial — banner de promoção + produtos recomendados

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardProduto from '../../components/produto/CardProduto';
import { produtosService } from '../../services/endpoints';
import { useCart } from '../../hooks/useCart';
import theme from '../../styles/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeScreen({ route }) {
  const navigation = useNavigation();
  const { empresa } = route.params || {};
  const { adicionarAoCarrinho, carregando: carregandoGlobal } = useCart();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    carregarProdutos();
  }, [empresa]);

  async function carregarProdutos() {
    try {
      setCarregando(true);
      const filtros = empresa ? { company_id: empresa.id } : {};
      const resposta = await produtosService.listar(filtros);
      const dados = resposta.data?.dados || resposta.data || [];
      setProdutos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleAdicionarAoCarrinho(produto) {
    try {
      await adicionarAoCarrinho(produto);
    } catch (e) {
      // Erro tratado no context
    }
  }

  if (!empresa) {
    return (
      <View style={[estilos.tela, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 50 }}>🏪</Text>
        <Text style={[estilos.secaoTitulo, { marginTop: 20 }]}>Selecione uma loja primeiro</Text>
        <TouchableOpacity 
          style={estilos.bannerBotao} 
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={[estilos.bannerBotaoTexto, { color: theme.cores.primaria }]}>Ver Restaurantes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.tela} showsVerticalScrollIndicator={false}>
      {/* Header Loja */}
      <View style={[estilos.headerLoja, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <Text style={estilos.nomeLoja}>{empresa.nome}</Text>
        <Text style={estilos.subLoja}>{empresa.categoria} • {empresa.tempo_entrega}</Text>
      </View>

      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>Cardápio</Text>
        {carregando ? (
          <ActivityIndicator color={theme.cores.primaria} size="large" style={{ marginTop: 20 }} />
        ) : produtos.length > 0 ? (
          produtos.map((produto) => (
            <CardProduto
              key={produto.id}
              produto={produto}
              onPress={() => navigation.navigate('DetalheProduto', { produto })}
              onAdicionar={() => handleAdicionarAoCarrinho(produto)}
              carregando={carregandoGlobal}
            />
          ))
        ) : (
          <Text style={estilos.vazio}>Nenhum produto encontrado nesta loja.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
  },
  headerLoja: {
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.lg,
    backgroundColor: theme.cores.primaria,
    borderBottomLeftRadius: theme.borda.raio.xl,
    borderBottomRightRadius: theme.borda.raio.xl,
  },
  nomeLoja: {
    fontSize: theme.fonte.tamanho.xxl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
  },
  subLoja: {
    fontSize: theme.fonte.tamanho.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  secao: {
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.lg,
    paddingBottom: theme.espacamento.xl,
  },
  secaoTitulo: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.md,
  },
  vazio: {
    textAlign: 'center',
    color: theme.cores.cinzaTexto,
    marginTop: 40,
  },
  bannerBotao: {
    backgroundColor: theme.cores.primaria,
    borderRadius: theme.borda.raio.full,
    paddingHorizontal: theme.espacamento.xl,
    paddingVertical: 12,
    marginTop: 20,
  },
  bannerBotaoTexto: {
    color: theme.cores.branco,
    fontWeight: theme.fonte.peso.bold,
    fontSize: theme.fonte.tamanho.md,
  },
});

export default HomeScreen;
