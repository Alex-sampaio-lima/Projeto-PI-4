// src/components/ui/Botao.js
// Componente de botão reutilizável

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';

/**
 * Botão principal do app
 * 
 * Props:
 *   titulo {string}    — texto do botão
 *   onPress {function} — função chamada ao clicar
 *   variante {string}  — 'primario' (azul) | 'secundario' (borda) | 'destaque' (laranja)
 *   carregando {bool}  — exibe spinner se true
 *   desabilitado {bool}
 *   estilo {object}    — estilos adicionais
 */
function Botao({ titulo, onPress, variante = 'primario', carregando = false, desabilitado = false, estilo }) {
  // Define as cores baseadas na variante
  const estilosVariante = {
    primario: {
      container: { backgroundColor: theme.cores.primaria },
      texto: { color: theme.cores.branco },
    },
    secundario: {
      container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.cores.primaria },
      texto: { color: theme.cores.primaria },
    },
    destaque: {
      container: { backgroundColor: theme.cores.destaque },
      texto: { color: theme.cores.branco },
    },
  };

  const varianteAtual = estilosVariante[variante] || estilosVariante.primario;

  return (
    <TouchableOpacity
      style={[
        estilos.container,
        varianteAtual.container,
        desabilitado && estilos.desabilitado,
        estilo,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={desabilitado || carregando}
    >
      {carregando ? (
        <ActivityIndicator color={varianteAtual.texto.color} />
      ) : (
        <Text style={[estilos.texto, varianteAtual.texto]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    borderRadius: theme.borda.raio.md,
    paddingVertical: 14,
    paddingHorizontal: theme.espacamento.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
  },
  desabilitado: {
    opacity: 0.5,
  },
});

export default Botao;
