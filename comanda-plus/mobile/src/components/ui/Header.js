// src/components/ui/Header.js
// Componente de cabeçalho reutilizável

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../styles/theme';

/**
 * Cabeçalho do app
 *
 * Props:
 *   titulo {string}       — texto do cabeçalho
 *   mostrarVoltar {bool}  — exibe seta de voltar
 *   acaoDireita {node}    — componente opcional no lado direito
 *   fundo {string}        — cor de fundo (padrão: primária azul)
 */
function Header({ titulo, mostrarVoltar = false, acaoDireita = null, fundo = theme.cores.primaria }) {
  const navigation = useNavigation();

  return (
    <View style={[estilos.container, { backgroundColor: fundo }]}>
      <StatusBar barStyle="light-content" backgroundColor={fundo} />

      {/* Botão voltar */}
      <View style={estilos.ladoEsquerdo}>
        {mostrarVoltar && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
            <Text style={estilos.setaVoltar}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Título centralizado */}
      <Text style={estilos.titulo} numberOfLines={1}>
        {titulo}
      </Text>

      {/* Ação direita (ex: ícone de carrinho) */}
      <View style={estilos.ladoDireito}>
        {acaoDireita}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: theme.espacamento.md,
    paddingTop: theme.espacamento.lg,
  },
  ladoEsquerdo: {
    width: 40,
    alignItems: 'flex-start',
  },
  ladoDireito: {
    width: 40,
    alignItems: 'flex-end',
  },
  botaoVoltar: {
    padding: 4,
  },
  setaVoltar: {
    fontSize: 22,
    color: theme.cores.branco,
    fontWeight: theme.fonte.peso.bold,
  },
  titulo: {
    flex: 1,
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
    textAlign: 'center',
  },
});

export default Header;
