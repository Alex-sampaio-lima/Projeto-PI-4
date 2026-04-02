// src/styles/globalStyles.js
// Estilos compartilhados entre as telas

import { StyleSheet } from 'react-native';
import theme from './theme';

const globalStyles = StyleSheet.create({
  // Containers
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.espacamento.md,
  },
  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Textos
  titulo: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
  },
  subtitulo: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
  },
  textoNormal: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.textoEscuro,
  },
  textoSecundario: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
  },
  preco: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.primaria,
  },

  // Card base
  card: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm,
    ...theme.sombra.leve,
  },

  // Divisor
  divisor: {
    height: 1,
    backgroundColor: theme.cores.cinzaMedio,
    marginVertical: theme.espacamento.sm,
  },

  // Input
  input: {
    backgroundColor: theme.cores.branco,
    borderWidth: 1,
    borderColor: theme.cores.cinzaMedio,
    borderRadius: theme.borda.raio.md,
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: theme.espacamento.sm,
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.md,
  },
});

export default globalStyles;
