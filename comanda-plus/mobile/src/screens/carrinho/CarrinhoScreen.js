// src/screens/carrinho/CarrinhoScreen.js
// Tela do carrinho de compras

import React, { useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemCarrinho from '../../components/carrinho/ItemCarrinho';
import Botao from '../../components/ui/Botao';
import { useCart } from '../../hooks/useCart';
import { formatarMoeda } from '../../utils/format';
import theme from '../../styles/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CarrinhoScreen() {
  const navigation = useNavigation();
  const {
    itensCarrinho,
    totalCarrinho,
    carregando,
    buscarCarrinho,
    atualizarQuantidade,
    removerDoCarrinho,
    limparCarrinho,
  } = useCart();
  const insets = useSafeAreaInsets();

  // Atualiza o carrinho toda vez que a tela é aberta
  useEffect(() => {
    buscarCarrinho();
  }, []);

  function handleLimparCarrinho() {
    Alert.alert(
      'Limpar Carrinho',
      'Tem certeza que deseja remover todos os itens?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: limparCarrinho },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={estilos.centralizador}>
        <ActivityIndicator color={theme.cores.primaria} size="large" />
      </View>
    );
  }

  if (itensCarrinho.length === 0) {
    return (
      <View style={estilos.vazio}>
        <Text style={estilos.emojiVazio}>🛒</Text>
        <Text style={estilos.tituloVazio}>Carrinho vazio</Text>
        <Text style={estilos.subtituloVazio}>Adicione produtos para continuar</Text>
        <Botao
          titulo="Ver Cardápio"
          onPress={() => navigation.navigate('Produtos')}
          estilo={estilos.botaoCardapio}
        />
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <View style={[estilos.header, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <Text style={estilos.headerTitulo}>Meu Carrinho</Text>
        <TouchableOpacity onPress={handleLimparCarrinho}>
          <Text style={estilos.linkLimpar}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de itens */}
      <FlatList
        data={itensCarrinho}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ItemCarrinho
            item={item}
            onAumentar={() => atualizarQuantidade(item.id, item.quantidade + 1)}
            onDiminuir={() => atualizarQuantidade(item.id, item.quantidade - 1)}
            onRemover={() => removerDoCarrinho(item.id)}
          />
        )}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer com total e botão */}
      <View style={[estilos.footer, { paddingBottom: Math.max(insets.bottom, theme.espacamento.md) }]}>
        <View style={estilos.resumo}>
          <Text style={estilos.resumoLabel}>{itensCarrinho.length} {itensCarrinho.length === 1 ? 'item' : 'itens'}</Text>
          <View style={estilos.totalRow}>
            <Text style={estilos.totalLabel}>Total:</Text>
            <Text style={estilos.totalValor}>{formatarMoeda(totalCarrinho)}</Text>
          </View>
        </View>
        <Botao
          titulo="Finalizar Pedido"
          onPress={() => navigation.navigate('Checkout')}
          estilo={estilos.botaoFinalizar}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.cores.cinzaClaro },
  centralizador: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: theme.cores.primaria,
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
  },
  headerTitulo: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.branco },
  linkLimpar: { color: 'rgba(255,255,255,0.8)', fontSize: theme.fonte.tamanho.sm },
  lista: { padding: theme.espacamento.md },
  // Carrinho vazio
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.espacamento.xl },
  emojiVazio: { fontSize: 60, marginBottom: theme.espacamento.md },
  tituloVazio: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro, marginBottom: 8 },
  subtituloVazio: { fontSize: theme.fonte.tamanho.md, color: theme.cores.cinzaTexto, marginBottom: theme.espacamento.xl },
  botaoCardapio: { width: 220 },
  // Footer
  footer: {
    backgroundColor: theme.cores.branco,
    padding: theme.espacamento.md,
    borderTopWidth: 1,
    borderTopColor: theme.cores.cinzaMedio,
    ...theme.sombra.media,
  },
  resumo: { marginBottom: theme.espacamento.sm },
  resumoLabel: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: theme.fonte.tamanho.lg, fontWeight: theme.fonte.peso.semibold, color: theme.cores.textoEscuro },
  totalValor: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.primaria },
  botaoFinalizar: { width: '100%' },
});

export default CarrinhoScreen;
