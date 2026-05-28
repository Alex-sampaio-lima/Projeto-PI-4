// src/components/carrinho/ItemCarrinho.js
// Item exibido na lista do carrinho

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { formatarMoeda } from '../../utils/format';

/**
 * Item do carrinho com controle de quantidade
 *
 * Props:
 *   item {object}              — { id, nome, preco, imagem, quantidade }
 *   onAumentar {function}      — aumenta quantidade
 *   onDiminuir {function}      — diminui quantidade (remove se for 0)
 *   onRemover {function}       — remove o item completamente
 */
function ItemCarrinho({ item, onAumentar, onDiminuir, onRemover }) {
  const subtotal = item.preco * item.quantidade;

  return (
    <View style={estilos.container}>
      {/* Imagem */}
      <Image source={{ uri: item.imagem }} style={estilos.imagem} />

      {/* Informações */}
      <View style={estilos.info}>
        <Text style={estilos.nome} numberOfLines={2}>{item.nome}</Text>
        <Text style={estilos.subtotal}>{formatarMoeda(subtotal)}</Text>
        <Text style={estilos.precoUnitario}>{formatarMoeda(item.preco)} / un</Text>
        {item.observacao ? (
          <Text style={estilos.observacao} numberOfLines={2}>
            💬 {item.observacao}
          </Text>
        ) : null}
      </View>

      {/* Controles de quantidade */}
      <View style={estilos.controles}>
        {/* Botão remover */}
        <TouchableOpacity style={estilos.botaoRemover} onPress={onRemover} activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={18} color={theme.cores.erro} />
        </TouchableOpacity>

        {/* Diminuir/Aumentar */}
        <View style={estilos.quantidade}>
          <TouchableOpacity style={estilos.botaoQtd} onPress={onDiminuir} activeOpacity={0.8}>
            <Ionicons name="remove" size={16} color={theme.cores.branco} />
          </TouchableOpacity>
          <Text style={estilos.numeroQtd}>{item.quantidade}</Text>
          <TouchableOpacity style={estilos.botaoQtd} onPress={onAumentar} activeOpacity={0.8}>
            <Ionicons name="add" size={16} color={theme.cores.branco} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.espacamento.sm,
    overflow: 'hidden',
    ...theme.sombra.leve,
  },
  imagem: {
    width: 80,
    height: 80,
    backgroundColor: theme.cores.cinzaMedio,
  },
  info: {
    flex: 1,
    paddingHorizontal: theme.espacamento.sm,
    paddingVertical: theme.espacamento.sm,
  },
  nome: {
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
  },
  subtotal: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.primaria,
    marginTop: 4,
  },
  precoUnitario: {
    fontSize: theme.fonte.tamanho.xs,
    color: theme.cores.cinzaTexto,
  },
  controles: {
    alignItems: 'center',
    paddingRight: theme.espacamento.sm,
    gap: 8,
  },
  botaoRemover: {
    padding: 4,
  },
  quantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botaoQtd: {
    width: 28,
    height: 28,
    borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroQtd: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    minWidth: 20,
    textAlign: 'center',
  },
  observacao: {
    fontSize: theme.fonte.tamanho.xs,
    fontStyle: 'italic',
    color: theme.cores.cinzaTexto,
    marginTop: 4,
    backgroundColor: theme.cores.cinzaClaro,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: theme.borda.raio.sm,
    alignSelf: 'flex-start',
  },
});

export default ItemCarrinho;
