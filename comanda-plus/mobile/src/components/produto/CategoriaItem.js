// src/components/produto/CategoriaItem.js
// Item de categoria exibido no filtro horizontal

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

/**
 * Chip/botão de categoria
 *
 * Props:
 *   categoria {object}   — { id, nome, icone }
 *   selecionado {bool}   — destaca a categoria ativa
 *   onPress {function}   — filtra produtos por categoria
 */
function CategoriaItem({ categoria, selecionado = false, onPress }) {
  return (
    <TouchableOpacity
      style={[estilos.container, selecionado && estilos.selecionado]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={estilos.icone}>{categoria.icone}</Text>
      <Text style={[estilos.nome, selecionado && estilos.nomeSelecionado]}>
        {categoria.nome}
      </Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: theme.espacamento.xs,
    borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.branco,
    borderWidth: 1.5,
    borderColor: theme.cores.cinzaMedio,
    marginRight: theme.espacamento.sm,
    gap: 6,
    ...theme.sombra.leve,
  },
  selecionado: {
    backgroundColor: theme.cores.primaria,
    borderColor: theme.cores.primaria,
  },
  icone: {
    fontSize: 16,
  },
  nome: {
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.medio,
    color: theme.cores.textoEscuro,
  },
  nomeSelecionado: {
    color: theme.cores.branco,
    fontWeight: theme.fonte.peso.bold,
  },
});

export default CategoriaItem;
