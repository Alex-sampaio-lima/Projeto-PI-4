// src/screens/carrinho/CheckoutScreen.js
// Tela de checkout — endereço, pagamento e resumo do pedido

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Botao from '../../components/ui/Botao';
import { useCart } from '../../hooks/useCart';
import { enderecosService, pedidosService } from '../../services/endpoints';
import { formatarMoeda, formatarEndereco } from '../../utils/format';
import theme from '../../styles/theme';

const FORMAS_PAGAMENTO = [
  { id: 'cartao_credito', nome: 'Cartão de Crédito', icone: '💳' },
  { id: 'cartao_debito', nome: 'Cartão de Débito', icone: '💳' },
  { id: 'pix', nome: 'PIX', icone: '⚡' },
  { id: 'dinheiro', nome: 'Dinheiro', icone: '💵' },
];

function CheckoutScreen() {
  const navigation = useNavigation();
  const { itensCarrinho, totalCarrinho, buscarCarrinho } = useCart();

  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(true);

  useEffect(() => {
    carregarEnderecos();
  }, []);

  async function carregarEnderecos() {
    try {
      const resposta = await enderecosService.listar();
      const lista = resposta.data?.dados || resposta.data || [];
      const enderecosArray = Array.isArray(lista) ? lista : [];
      setEnderecos(enderecosArray);
      // Já seleciona o endereço principal automaticamente
      const principal = enderecosArray.find((e) => e.principal);
      if (principal) setEnderecoSelecionado(principal);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error.message);
    } finally {
      setCarregandoEnderecos(false);
    }
  }

  async function handleFinalizarPedido() {
    if (!enderecoSelecionado) {
      Alert.alert('Atenção', 'Selecione um endereço de entrega.');
      return;
    }
    if (!pagamentoSelecionado) {
      Alert.alert('Atenção', 'Selecione uma forma de pagamento.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await pedidosService.criar({
        address_id: enderecoSelecionado.id,
        observacao: `Pagamento: ${pagamentoSelecionado.nome}`,
      });

      // Atualiza o carrinho (que foi limpo pelo backend)
      await buscarCarrinho();

      // Navega para a tela de sucesso
      navigation.navigate('PedidoFinalizado', { pedido: resposta.data.dados });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar o pedido. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <View style={estilos.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
          <Text style={estilos.setaVoltar}>←</Text>
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.scroll}>
        {/* Seção: Endereço */}
        <Text style={estilos.secaoTitulo}>📍 Endereço de Entrega</Text>
        {carregandoEnderecos ? (
          <ActivityIndicator color={theme.cores.primaria} />
        ) : enderecos.length === 0 ? (
          <TouchableOpacity
            style={estilos.adicionarEndereco}
            onPress={() => navigation.navigate('Enderecos')}
          >
            <Text style={estilos.textoAdicionarEndereco}>+ Adicionar endereço</Text>
          </TouchableOpacity>
        ) : (
          enderecos.map((endereco) => (
            <TouchableOpacity
              key={endereco.id}
              style={[estilos.enderecoCard, enderecoSelecionado?.id === endereco.id && estilos.selecionado]}
              onPress={() => setEnderecoSelecionado(endereco)}
            >
              <View style={estilos.radioOuter}>
                {enderecoSelecionado?.id === endereco.id && <View style={estilos.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.enderecoTexto}>{formatarEndereco(endereco)}</Text>
                {endereco.principal ? <Text style={estilos.principal}>Principal</Text> : null}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Seção: Pagamento */}
        <Text style={[estilos.secaoTitulo, { marginTop: theme.espacamento.lg }]}>💳 Forma de Pagamento</Text>
        {FORMAS_PAGAMENTO.map((pag) => (
          <TouchableOpacity
            key={pag.id}
            style={[estilos.pagamentoCard, pagamentoSelecionado?.id === pag.id && estilos.selecionado]}
            onPress={() => setPagamentoSelecionado(pag)}
          >
            <View style={estilos.radioOuter}>
              {pagamentoSelecionado?.id === pag.id && <View style={estilos.radioInner} />}
            </View>
            <Text style={estilos.pagamentoIcone}>{pag.icone}</Text>
            <Text style={estilos.pagamentoNome}>{pag.nome}</Text>
          </TouchableOpacity>
        ))}

        {/* Seção: Resumo */}
        <Text style={[estilos.secaoTitulo, { marginTop: theme.espacamento.lg }]}>🧾 Resumo do Pedido</Text>
        <View style={estilos.resumoCard}>
          {itensCarrinho.map((item) => (
            <View key={item.id} style={estilos.resumoItem}>
              <Text style={estilos.resumoNome}>{item.quantidade}x {item.nome}</Text>
              <Text style={estilos.resumoPreco}>{formatarMoeda(item.preco * item.quantidade)}</Text>
            </View>
          ))}
          <View style={estilos.divisor} />
          <View style={estilos.resumoItem}>
            <Text style={estilos.resumoTotal}>Total</Text>
            <Text style={estilos.resumoTotalValor}>{formatarMoeda(totalCarrinho)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão finalizar */}
      <View style={estilos.footer}>
        <Botao
          titulo={`Confirmar Pedido • ${formatarMoeda(totalCarrinho)}`}
          onPress={handleFinalizarPedido}
          carregando={carregando}
          estilo={estilos.botaoConfirmar}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.cores.cinzaClaro },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.cores.primaria,
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
  },
  botaoVoltar: { width: 40, alignItems: 'flex-start' },
  setaVoltar: { color: theme.cores.branco, fontSize: 22, fontWeight: 'bold' },
  headerTitulo: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.branco },
  scroll: { padding: theme.espacamento.md, paddingBottom: theme.espacamento.xxl },
  secaoTitulo: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro, marginBottom: theme.espacamento.sm },
  enderecoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md, padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm, borderWidth: 2, borderColor: 'transparent', ...theme.sombra.leve,
  },
  pagamentoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md, padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm, borderWidth: 2, borderColor: 'transparent', ...theme.sombra.leve,
  },
  selecionado: { borderColor: theme.cores.primaria },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: theme.cores.primaria, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.cores.primaria },
  enderecoTexto: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.textoEscuro },
  principal: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.primaria, fontWeight: theme.fonte.peso.semibold, marginTop: 2 },
  adicionarEndereco: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.cores.primaria,
    borderRadius: theme.borda.raio.md, padding: theme.espacamento.md, alignItems: 'center',
  },
  textoAdicionarEndereco: { color: theme.cores.primaria, fontWeight: theme.fonte.peso.semibold },
  pagamentoIcone: { fontSize: 20, marginRight: 10 },
  pagamentoNome: { fontSize: theme.fonte.tamanho.md, color: theme.cores.textoEscuro },
  resumoCard: { backgroundColor: theme.cores.branco, borderRadius: theme.borda.raio.md, padding: theme.espacamento.md, ...theme.sombra.leve },
  resumoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  resumoNome: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.textoEscuro, flex: 1 },
  resumoPreco: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.textoEscuro, fontWeight: theme.fonte.peso.medio },
  divisor: { height: 1, backgroundColor: theme.cores.cinzaMedio, marginVertical: theme.espacamento.sm },
  resumoTotal: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro },
  resumoTotalValor: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.primaria },
  footer: { backgroundColor: theme.cores.branco, padding: theme.espacamento.md, borderTopWidth: 1, borderTopColor: theme.cores.cinzaMedio },
  botaoConfirmar: { width: '100%' },
});

export default CheckoutScreen;
