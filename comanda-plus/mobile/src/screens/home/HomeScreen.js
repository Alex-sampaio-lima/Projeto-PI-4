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

function HomeScreen() {
  const navigation = useNavigation();
  const { adicionarAoCarrinho, carregando: carregandoGlobal } = useCart();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const resposta = await produtosService.listar();
      const dados = resposta.data?.dados || resposta.data || [];
      // Pega os 5 primeiros como "recomendados"
      const lista = Array.isArray(dados) ? dados : [];
      setProdutos(lista.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleAdicionarAoCarrinho(produto) {
    try {
      await adicionarAoCarrinho(produto.id);
    } catch (e) {
      // O erro já é tratado no context
    }
  }

  return (
    <ScrollView style={estilos.tela} showsVerticalScrollIndicator={false}>
      {/* Header do Home */}
      <View style={estilos.header}>
        <View>
          <Text style={estilos.saudacao}>Olá! 👋</Text>
          <Text style={estilos.pergunta}>O que vai pedir hoje?</Text>
        </View>
        <TouchableOpacity
          style={estilos.iconePerfil}
          onPress={() => navigation.navigate('Conta')}
        >
          <Text style={estilos.emojiPerfil}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Banner de promoção — laranja como no Figma */}
      <View style={estilos.banner}>
        <View style={estilos.bannerTexto}>
          <Text style={estilos.bannerTitulo}>Promoção</Text>
          <Text style={estilos.bannerDesconto}>15% OFF</Text>
          <Text style={estilos.bannerSub}>Em pedidos acima de R$ 50,00</Text>
          <TouchableOpacity style={estilos.bannerBotao} onPress={() => navigation.navigate('Produtos')}>
            <Text style={estilos.bannerBotaoTexto}>Ver Cardápio</Text>
          </TouchableOpacity>
        </View>
        <Text style={estilos.bannerEmoji}>🍔</Text>
      </View>

      {/* Seção: Recomendados */}
      <View style={estilos.secao}>
        <View style={estilos.secaoHeader}>
          <Text style={estilos.secaoTitulo}>Recomendados</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Produtos')}>
            <Text style={estilos.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator color={theme.cores.primaria} size="large" style={{ marginTop: 20 }} />
        ) : (
          produtos.map((produto) => (
            <CardProduto
              key={produto.id}
              produto={produto}
              onPress={() => navigation.navigate('DetalheProduto', { produto })}
              onAdicionar={() => handleAdicionarAoCarrinho(produto)}
              carregando={carregandoGlobal}
            />
          ))
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
  // Banner laranja
  banner: {
    backgroundColor: theme.cores.destaque,
    marginHorizontal: theme.espacamento.md,
    borderRadius: theme.borda.raio.lg,
    padding: theme.espacamento.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.espacamento.md,
    ...theme.sombra.media,
  },
  bannerTexto: { flex: 1 },
  bannerTitulo: {
    fontSize: theme.fonte.tamanho.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: theme.fonte.peso.medio,
  },
  bannerDesconto: {
    fontSize: theme.fonte.tamanho.xxl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
  },
  bannerSub: {
    fontSize: theme.fonte.tamanho.xs,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: theme.espacamento.sm,
  },
  bannerBotao: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.full,
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  bannerBotaoTexto: {
    color: theme.cores.destaque,
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.bold,
  },
  bannerEmoji: { fontSize: 60, marginLeft: 8 },
  // Seção
  secao: {
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.lg,
    paddingBottom: theme.espacamento.xl,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.espacamento.sm,
  },
  secaoTitulo: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
  },
  verTodos: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.primaria,
    fontWeight: theme.fonte.peso.semibold,
  },
});

export default HomeScreen;
