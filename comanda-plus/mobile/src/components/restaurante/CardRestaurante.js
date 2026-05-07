// src/components/restaurante/CardRestaurante.js
// Card de empresa (restaurante) exibido na listagem da Home

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { formatarAvaliacao } from '../../utils/format';

/**
 * Card de Restaurante
 *
 * Props:
 *   empresa {object}   — dados da empresa (nome, logo, avaliacao, tempo_entrega, frete)
 *   onPress {function} — ação de navegação
 */
function CardRestaurante({ empresa, onPress }) {
  return (
    <TouchableOpacity style={estilos.container} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: empresa.logo }}
        style={estilos.logo}
        resizeMode="contain"
      />

      <View style={estilos.info}>
        <Text style={estilos.nome}>{empresa.nome}</Text>
        
        <View style={estilos.detalhes}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={estilos.textoAvaliacao}>{formatarAvaliacao(empresa.avaliacao)}</Text>
          <Text style={estilos.separador}>•</Text>
          <Text style={estilos.textoInfo}>{empresa.categoria}</Text>
        </View>

        <View style={estilos.entregaInfo}>
          <Text style={estilos.textoInfo}>{empresa.tempo_entrega}</Text>
          <Text style={estilos.separador}>•</Text>
          <Text style={[estilos.textoInfo, { color: empresa.frete === 0 ? theme.cores.sucesso : theme.cores.cinzaTexto }]}>
            {empresa.frete === 0 ? 'Frete grátis' : `Frete R$ ${empresa.frete.toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.cores.branco,
    padding: theme.espacamento.md,
    borderRadius: theme.borda.raio.lg,
    marginBottom: theme.espacamento.md,
    alignItems: 'center',
    ...theme.sombra.leve,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: theme.borda.raio.md,
    backgroundColor: theme.cores.cinzaClaro,
  },
  info: {
    flex: 1,
    marginLeft: theme.espacamento.md,
  },
  nome: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: 2,
  },
  detalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  textoAvaliacao: {
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.semibold,
    color: '#FFD700',
    marginLeft: 4,
  },
  entregaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoInfo: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
  },
  separador: {
    marginHorizontal: 6,
    color: theme.cores.cinzaMedio,
    fontSize: 10,
  },
});

export default CardRestaurante;
