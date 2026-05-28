// src/screens/produtos/DetalheProdutoScreen.js
// Tela de detalhe de um produto

import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../../components/ui/Botao';
import { useCart } from '../../hooks/useCart';
import { formatarMoeda, formatarAvaliacao } from '../../utils/format';
import theme from '../../styles/theme';

function DetalheProdutoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { adicionarAoCarrinho } = useCart();

  // Produto recebido via params de navegação
  const { produto } = route.params;
  const [quantidade, setQuantidade] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [carregando, setCarregando] = useState(false);

  function aumentarQuantidade() {
    setQuantidade((q) => q + 1);
  }

  function diminuirQuantidade() {
    if (quantidade > 1) setQuantidade((q) => q - 1);
  }

  async function handleAdicionarAoCarrinho() {
    setCarregando(true);
    try {
      await adicionarAoCarrinho(produto, quantidade, observacoes);
      Alert.alert(
        '✅ Adicionado!',
        `${quantidade}x ${produto.nome} foi adicionado ao carrinho.`,
        [
          { text: 'Ver Carrinho', onPress: () => navigation.navigate('Carrinho') },
          { text: 'Continuar', style: 'cancel' },
        ]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho.');
    } finally {
      setCarregando(false);
    }
  }

  const totalItem = produto.preco * quantidade;

  return (
    <View style={estilos.tela}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagem do produto */}
        <View style={estilos.imagemContainer}>
          <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color={theme.cores.branco} />
          </TouchableOpacity>
          <Image source={{ uri: produto.imagem }} style={estilos.imagem} />
        </View>

        {/* Informações do produto */}
        <View style={estilos.conteudo}>
          {/* Categoria */}
          {produto.categoria_nome && (
            <View style={estilos.badgeCategoria}>
              <Text style={estilos.textoCategoria}>{produto.categoria_nome}</Text>
            </View>
          )}

          {/* Nome */}
          <Text style={estilos.nome}>{produto.nome}</Text>

          {/* Avaliação */}
          <View style={estilos.avaliacaoRow}>
            <Text style={estilos.avaliacao}>{formatarAvaliacao(produto.avaliacao)}</Text>
            <Text style={estilos.totalAvaliacoes}>(128 avaliações)</Text>
          </View>

          {/* Descrição */}
          <Text style={estilos.descricao}>
            {produto.descricao || 'Produto selecionado com ingredientes de qualidade.'}
          </Text>

          {/* Divisor */}
          <View style={estilos.divisor} />

          {/* Observações */}
          <View style={estilos.observacaoContainer}>
            <View style={estilos.observacaoHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.cores.primaria} />
              <Text style={estilos.observacaoTitulo}>Alguma observação?</Text>
            </View>
            <TextInput
              style={estilos.observacaoInput}
              placeholder="Ex: Sem cebola, molho à parte, carne bem passada..."
              placeholderTextColor={theme.cores.cinzaTexto}
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              numberOfLines={2}
              maxLength={140}
            />
          </View>

          {/* Divisor */}
          <View style={estilos.divisor} />

          {/* Controle de quantidade */}
          <View style={estilos.quantidadeRow}>
            <Text style={estilos.quantidadeTitulo}>Quantidade</Text>
            <View style={estilos.quantidadeControle}>
              <TouchableOpacity style={estilos.botaoQtd} onPress={diminuirQuantidade} activeOpacity={0.8}>
                <Ionicons name="remove" size={20} color={theme.cores.branco} />
              </TouchableOpacity>
              <Text style={estilos.numeroQtd}>{quantidade}</Text>
              <TouchableOpacity style={estilos.botaoQtd} onPress={aumentarQuantidade} activeOpacity={0.8}>
                <Ionicons name="add" size={20} color={theme.cores.branco} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer: preço e botão */}
      <View style={estilos.footer}>
        <View>
          <Text style={estilos.labelPreco}>Total</Text>
          <Text style={estilos.preco}>{formatarMoeda(totalItem)}</Text>
        </View>
        <Botao
          titulo="Adicionar ao Carrinho"
          onPress={handleAdicionarAoCarrinho}
          carregando={carregando}
          estilo={estilos.botaoAdicionar}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.cores.branco },
  imagemContainer: { position: 'relative' },
  imagem: { width: '100%', height: 260, backgroundColor: theme.cores.cinzaMedio },
  botaoVoltar: {
    position: 'absolute',
    top: theme.espacamento.xl,
    left: theme.espacamento.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: theme.borda.raio.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    padding: theme.espacamento.md,
    borderTopLeftRadius: theme.borda.raio.lg,
    borderTopRightRadius: theme.borda.raio.lg,
    marginTop: -16,
    backgroundColor: theme.cores.branco,
  },
  badgeCategoria: {
    alignSelf: 'flex-start',
    backgroundColor: theme.cores.cinzaClaro,
    borderRadius: theme.borda.raio.full,
    paddingHorizontal: theme.espacamento.sm,
    paddingVertical: 4,
    marginBottom: theme.espacamento.sm,
  },
  textoCategoria: {
    fontSize: theme.fonte.tamanho.xs,
    color: theme.cores.primaria,
    fontWeight: theme.fonte.peso.semibold,
  },
  nome: {
    fontSize: theme.fonte.tamanho.xxl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.xs,
  },
  avaliacaoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: theme.espacamento.sm },
  avaliacao: { fontSize: theme.fonte.tamanho.md, color: theme.cores.destaque, fontWeight: theme.fonte.peso.bold },
  totalAvaliacoes: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  descricao: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.cinzaTexto,
    lineHeight: 22,
    marginBottom: theme.espacamento.md,
  },
  divisor: { height: 1, backgroundColor: theme.cores.cinzaMedio, marginVertical: theme.espacamento.sm },
  quantidadeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantidadeTitulo: { fontSize: theme.fonte.tamanho.lg, fontWeight: theme.fonte.peso.semibold, color: theme.cores.textoEscuro },
  quantidadeControle: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  botaoQtd: {
    width: 36, height: 36, borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.primaria, alignItems: 'center', justifyContent: 'center',
  },
  numeroQtd: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro, minWidth: 28, textAlign: 'center' },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: theme.espacamento.md, backgroundColor: theme.cores.branco, borderTopWidth: 1, borderTopColor: theme.cores.cinzaMedio,
  },
  labelPreco: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  preco: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.primaria },
  botaoAdicionar: { flex: 1, marginLeft: theme.espacamento.md },
  observacaoContainer: {
    marginVertical: theme.espacamento.xs,
  },
  observacaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.espacamento.xs,
  },
  observacaoTitulo: {
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
  },
  observacaoInput: {
    backgroundColor: theme.cores.cinzaClaro,
    borderWidth: 1,
    borderColor: theme.cores.cinzaMedio,
    borderRadius: theme.borda.raio.md,
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: theme.espacamento.sm,
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.textoEscuro,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default DetalheProdutoScreen;
