// src/components/produto/CardProduto.js
// Card de produto exibido nas listagens

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import { formatarMoeda, formatarAvaliacao } from '../../utils/format';

/**
 * Card de produto
 *
 * Props:
 *   produto {object}       — dados do produto (nome, preco, imagem, avaliacao)
 *   onPress {function}     — navega para o detalhe do produto
 *   onAdicionar {function} — adiciona ao carrinho diretamente
 *   carregando {boolean}   — se true, mostra spinner no botão "+"
 */
function CardProduto({ produto, onPress, onAdicionar, carregando = false }) {
  return (
    <TouchableOpacity style={estilos.container} onPress={onPress} activeOpacity={0.9}>
      {/* Imagem do produto */}
      <Image
        source={{ uri: produto.imagem }}
        style={estilos.imagem}
        defaultSource={{ uri: 'https://via.placeholder.com/90x90?text=Food' }}
      />

      {/* Informações */}
      <View style={estilos.info}>
        <Text style={estilos.nome} numberOfLines={2}>{produto.nome}</Text>
        <Text style={estilos.avaliacao}>{formatarAvaliacao(produto.avaliacao)}</Text>
        <Text style={estilos.preco}>{formatarMoeda(produto.preco)}</Text>
      </View>

      {/* Botão de adicionar */}
      <TouchableOpacity 
        style={estilos.botaoAdicionar} 
        onPress={onAdicionar} 
        activeOpacity={0.8}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color={theme.cores.branco} size="small" />
        ) : (
          <Text style={estilos.textoBotao}>+</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    marginBottom: theme.espacamento.sm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...theme.sombra.leve,
  },
  imagem: {
    width: 90,
    height: 90,
    backgroundColor: theme.cores.cinzaMedio,
  },
  info: {
    flex: 1,
    paddingHorizontal: theme.espacamento.sm,
    paddingVertical: theme.espacamento.sm,
  },
  nome: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
    marginBottom: 2,
  },
  avaliacao: {
    fontSize: theme.fonte.tamanho.xs,
    color: theme.cores.cinzaTexto,
    marginBottom: 4,
  },
  preco: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.primaria,
  },
  botaoAdicionar: {
    backgroundColor: theme.cores.primaria,
    width: 36,
    height: 36,
    borderRadius: theme.borda.raio.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.espacamento.sm,
  },
  textoBotao: {
    color: theme.cores.branco,
    fontSize: 22,
    fontWeight: theme.fonte.peso.bold,
    lineHeight: 26,
  },
});

export default CardProduto;
