// src/screens/pedido/PedidoFinalizadoScreen.js
// Tela de confirmação de pedido realizado com sucesso

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Botao from '../../components/ui/Botao';
import { formatarMoeda, formatarData } from '../../utils/format';
import theme from '../../styles/theme';

function PedidoFinalizadoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { pedido } = route.params || {};

  function handleVoltar() {
    // Volta para a Home e limpa o stack de navegação
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }

  return (
    <View style={estilos.tela}>
      {/* Ícone de sucesso */}
      <View style={estilos.iconeContainer}>
        <Text style={estilos.icone}>✅</Text>
      </View>

      {/* Títulos */}
      <Text style={estilos.titulo}>Pedido Confirmado!</Text>
      <Text style={estilos.subtitulo}>
        Seu pedido foi recebido e está sendo preparado.
      </Text>

      {/* Card com detalhes do pedido */}
      {pedido && (
        <View style={estilos.card}>
          <View style={estilos.linhaDados}>
            <Text style={estilos.labelDado}>Número do Pedido</Text>
            <Text style={estilos.valorDado}>#{pedido.id}</Text>
          </View>
          <View style={estilos.divisor} />

          <View style={estilos.linhaDados}>
            <Text style={estilos.labelDado}>Data</Text>
            <Text style={estilos.valorDado}>{formatarData(pedido.created_at)}</Text>
          </View>
          <View style={estilos.divisor} />

          <View style={estilos.linhaDados}>
            <Text style={estilos.labelDado}>Status</Text>
            <View style={estilos.badgeStatus}>
              <Text style={estilos.textoStatus}>✅ Confirmado</Text>
            </View>
          </View>
          <View style={estilos.divisor} />

          {pedido.frete !== undefined && pedido.frete !== null ? (
            <>
              <View style={estilos.linhaDados}>
                <Text style={estilos.labelDado}>Subtotal</Text>
                <Text style={estilos.valorDado}>{formatarMoeda(pedido.total - pedido.frete)}</Text>
              </View>
              <View style={estilos.divisor} />

              <View style={estilos.linhaDados}>
                <Text style={estilos.labelDado}>Taxa de entrega</Text>
                <Text style={estilos.valorDado}>
                  {pedido.frete > 0 ? formatarMoeda(pedido.frete) : 'Grátis'}
                </Text>
              </View>
              <View style={estilos.divisor} />
            </>
          ) : null}

          <View style={estilos.linhaDados}>
            <Text style={estilos.labelDado}>Total Pago</Text>
            <Text style={estilos.totalValor}>{formatarMoeda(pedido.total)}</Text>
          </View>

          {/* Itens do pedido */}
          {pedido.itens && pedido.itens.length > 0 && (
            <>
              <View style={estilos.divisor} />
              <Text style={estilos.itensTitulo}>Itens do Pedido</Text>
              {pedido.itens.map((item) => (
                <View key={item.id} style={estilos.itemContainer}>
                  <View style={estilos.itemRow}>
                    <Text style={estilos.itemNome}>{item.quantidade}x {item.produto_nome}</Text>
                    <Text style={estilos.itemPreco}>{formatarMoeda(item.preco_unitario * item.quantidade)}</Text>
                  </View>
                  {item.observacao ? (
                    <Text style={estilos.itemObservacao}>💬 {item.observacao}</Text>
                  ) : null}
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {/* Mensagem de prazo */}
      <View style={estilos.prazoContainer}>
        <Text style={estilos.prazoEmoji}>🛵</Text>
        <Text style={estilos.prazoTexto}>Tempo estimado: 30-45 minutos</Text>
      </View>

      {/* Botão de voltar */}
      <Botao
        titulo="Voltar ao Início"
        onPress={handleVoltar}
        estilo={estilos.botao}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1, backgroundColor: theme.cores.branco,
    padding: theme.espacamento.lg, alignItems: 'center', justifyContent: 'center',
  },
  iconeContainer: {
    width: 100, height: 100, borderRadius: theme.borda.raio.full,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.espacamento.lg,
  },
  icone: { fontSize: 48 },
  titulo: {
    fontSize: theme.fonte.tamanho.xxl, fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro, textAlign: 'center', marginBottom: theme.espacamento.sm,
  },
  subtitulo: {
    fontSize: theme.fonte.tamanho.md, color: theme.cores.cinzaTexto,
    textAlign: 'center', marginBottom: theme.espacamento.xl,
  },
  card: {
    width: '100%', backgroundColor: theme.cores.branco, borderRadius: theme.borda.raio.md,
    padding: theme.espacamento.md, marginBottom: theme.espacamento.lg, ...theme.sombra.media,
    borderWidth: 1, borderColor: theme.cores.cinzaMedio,
  },
  linhaDados: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  labelDado: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  valorDado: { fontSize: theme.fonte.tamanho.sm, fontWeight: theme.fonte.peso.semibold, color: theme.cores.textoEscuro },
  badgeStatus: {
    backgroundColor: '#E8F5E9', borderRadius: theme.borda.raio.full,
    paddingHorizontal: theme.espacamento.sm, paddingVertical: 4,
  },
  textoStatus: { color: '#27AE60', fontSize: theme.fonte.tamanho.xs, fontWeight: theme.fonte.peso.bold },
  totalValor: { fontSize: theme.fonte.tamanho.lg, fontWeight: theme.fonte.peso.bold, color: theme.cores.primaria },
  divisor: { height: 1, backgroundColor: theme.cores.cinzaMedio },
  itensTitulo: { fontSize: theme.fonte.tamanho.sm, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro, marginTop: 8, marginBottom: 4 },
  itemContainer: { marginBottom: 6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemNome: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.cinzaTexto, flex: 1 },
  itemPreco: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.textoEscuro, fontWeight: theme.fonte.peso.medio },
  itemObservacao: {
    fontSize: theme.fonte.tamanho.xs - 1,
    fontStyle: 'italic',
    color: theme.cores.cinzaTexto,
    marginTop: 1,
    marginLeft: 18,
  },
  prazoContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.cores.cinzaClaro, borderRadius: theme.borda.raio.md,
    padding: theme.espacamento.sm, marginBottom: theme.espacamento.lg, width: '100%',
    justifyContent: 'center',
  },
  prazoEmoji: { fontSize: 20 },
  prazoTexto: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  botao: { width: '100%' },
});

export default PedidoFinalizadoScreen;
