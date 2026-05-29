// src/screens/carrinho/CheckoutScreen.js
// Tela de checkout — endereço, pagamento e resumo do pedido

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, Platform, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../../components/ui/Botao';
import { useCart } from '../../hooks/useCart';
import { enderecosService, pedidosService, formasPagamentoService } from '../../services/endpoints';
import { formatarMoeda, formatarEndereco } from '../../utils/format';
import theme from '../../styles/theme';

import * as WebBrowser from 'expo-web-browser';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OPCOES_PADRAO = [
  { id: 'mercadopago', tipo: 'Mercado Pago', bandeira: 'Pagar com Mercado Pago', icone: '🔵' },
  { id: 'dinheiro', tipo: 'Dinheiro', bandeira: 'Dinheiro na Entrega', icone: '💵' },
];

function CheckoutScreen() {
  const navigation = useNavigation();
  const { itensCarrinho, totalCarrinho, freteCarrinho, buscarCarrinho } = useCart();

  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [formasPagamento, setFormasPagamento] = useState(OPCOES_PADRAO);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(true);
  const [carregandoPagamentos, setCarregandoPagamentos] = useState(true);
  const [modalEnderecosVisivel, setModalEnderecosVisivel] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    carregarEnderecos();
    carregarFormasPagamento();

    const unsubscribe = navigation.addListener('focus', () => {
      carregarEnderecos();
      carregarFormasPagamento();
    });

    return unsubscribe;
  }, [navigation]);

  async function carregarEnderecos() {
    try {
      const resposta = await enderecosService.listar();
      const lista = resposta.data?.dados || resposta.data || [];
      const enderecosArray = Array.isArray(lista) ? lista : [];
      setEnderecos(enderecosArray);

      // Tenta manter a seleção anterior se ela ainda estiver na nova lista
      if (enderecoSelecionado) {
        const aindaExiste = enderecosArray.find((e) => e.id === enderecoSelecionado.id);
        if (aindaExiste) {
          setEnderecoSelecionado(aindaExiste);
          return;
        }
      }

      // Caso contrário, seleciona o principal ou o primeiro
      const principal = enderecosArray.find((e) => e.principal);
      if (principal) {
        setEnderecoSelecionado(principal);
      } else if (enderecosArray.length > 0) {
        setEnderecoSelecionado(enderecosArray[0]);
      } else {
        setEnderecoSelecionado(null);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error.message);
    } finally {
      setCarregandoEnderecos(false);
    }
  }

  async function carregarFormasPagamento() {
    try {
      const resposta = await formasPagamentoService.listar();
      const lista = resposta.data?.dados || resposta.data || [];
      const pagamentosArray = Array.isArray(lista) ? lista : [];
      
      const combinadas = [...OPCOES_PADRAO, ...pagamentosArray];
      setFormasPagamento(combinadas);
      
      // Seleciona a forma de pagamento principal (padrão) automaticamente se houver
      const principal = pagamentosArray.find((p) => p.principal);
      if (principal) {
        setPagamentoSelecionado(principal);
      } else if (!pagamentoSelecionado && combinadas.length > 0) {
        setPagamentoSelecionado(combinadas[0]); // Seleciona o Mercado Pago padrão por default
      }
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error.message);
      setFormasPagamento(OPCOES_PADRAO);
    } finally {
      setCarregandoPagamentos(false);
    }
  }

  async function handleFinalizarPedido() {
    if (!enderecoSelecionado) {
      if (Platform.OS === 'web') window.alert('Atenção: Selecione um endereço de entrega.');
      else Alert.alert('Atenção', 'Selecione um endereço de entrega.');
      return;
    }
    if (!pagamentoSelecionado) {
      if (Platform.OS === 'web') window.alert('Atenção: Selecione uma forma de pagamento.');
      else Alert.alert('Atenção', 'Selecione uma forma de pagamento.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await pedidosService.criar({
        address_id: enderecoSelecionado.id,
        observacao: `Pagamento: ${pagamentoSelecionado.tipo} • ${pagamentoSelecionado.bandeira}${pagamentoSelecionado.final ? ` (Final ${pagamentoSelecionado.final})` : ''}`,
        forma_pagamento: pagamentoSelecionado.id === 'mercadopago' ? 'mercadopago' : (pagamentoSelecionado.tipo || 'Dinheiro'),
      });
      
      const pedido = resposta.data.dados;

      // Se escolheu Mercado Pago, abre a tela de pagamento
      if (
        pagamentoSelecionado.tipo?.toLowerCase() === 'mercadopago' ||
        pagamentoSelecionado.bandeira?.toLowerCase() === 'mercadopago' ||
        pagamentoSelecionado.id === 'mercadopago'
      ) {
        try {
          const prefResp = await pedidosService.criarPreferencia(pedido.id);
          const { init_point } = prefResp.data;
          
          if (init_point) {
            await WebBrowser.openBrowserAsync(init_point);
          }
        } catch (mpError) {
          console.error('Erro ao criar preferência do Mercado Pago:', mpError.message);
          if (Platform.OS === 'web') {
            window.alert('Aviso: A integração do Mercado Pago falhou no ambiente de teste, mas seu pedido foi registrado no sistema!');
          } else {
            Alert.alert('Aviso', 'A integração do Mercado Pago falhou no ambiente de teste, mas seu pedido foi registrado no sistema!');
          }
        }
      }

      // Atualiza o carrinho (que foi limpo pelo backend)
      await buscarCarrinho();

      // Navega para a tela de sucesso
      navigation.navigate('PedidoFinalizado', { pedido });
    } catch (error) {
      if (Platform.OS === 'web') window.alert('Erro: Não foi possível finalizar o pedido. Tente novamente.');
      else Alert.alert('Erro', 'Não foi possível finalizar o pedido. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <View style={[estilos.header, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={theme.cores.branco} />
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.scroll}>
          {/* Seção: Endereço de Entrega */}
          <View style={estilos.secaoHeader}>
            <Text style={estilos.secaoTitulo}>
              <Ionicons name="location-outline" size={18} color={theme.cores.primaria} /> Endereço de Entrega
            </Text>
            {enderecos.length > 0 && (
              <TouchableOpacity onPress={() => setModalEnderecosVisivel(true)} activeOpacity={0.7}>
                <Text style={estilos.textoAlterar}>Alterar</Text>
              </TouchableOpacity>
            )}
          </View>

          {carregandoEnderecos ? (
            <ActivityIndicator color={theme.cores.primaria} style={{ marginVertical: 12 }} />
          ) : !enderecoSelecionado ? (
            <TouchableOpacity
              style={estilos.adicionarEndereco}
              onPress={() => {
                setModalEnderecosVisivel(false);
                navigation.navigate('Enderecos');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color={theme.cores.primaria} style={{ marginRight: 6 }} />
              <Text style={estilos.textoAdicionarEndereco}>Adicionar endereço de entrega</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={estilos.enderecoCardSelecionado}
              onPress={() => setModalEnderecosVisivel(true)}
              activeOpacity={0.9}
            >
              <View style={estilos.enderecoIconeContainer}>
                <Ionicons name="location" size={24} color={theme.cores.primaria} />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={estilos.enderecoTextoTitulo}>
                  {enderecoSelecionado.rua}, {enderecoSelecionado.numero}
                </Text>
                <Text style={estilos.enderecoTextoSubtitulo}>
                  {enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.estado}
                </Text>
                {enderecoSelecionado.complemento ? (
                  <Text style={estilos.enderecoTextoComplemento}>
                    Comp: {enderecoSelecionado.complemento}
                  </Text>
                ) : null}
                {enderecoSelecionado.principal ? (
                  <View style={estilos.tagPrincipal}>
                    <Text style={estilos.tagPrincipalTexto}>Principal</Text>
                  </View>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.cores.cinzaTexto} />
            </TouchableOpacity>
          )}

          {/* Seção: Pagamento */}
          <Text style={[estilos.secaoTitulo, { marginTop: theme.espacamento.lg }]}>
            <Ionicons name="card-outline" size={18} color={theme.cores.primaria} /> Forma de Pagamento
          </Text>
          {carregandoPagamentos ? (
            <ActivityIndicator color={theme.cores.primaria} />
          ) : formasPagamento.length === 0 ? (
            <TouchableOpacity
              style={estilos.adicionarEndereco}
              onPress={() => navigation.navigate('Pagamentos')}
            >
              <Text style={estilos.textoAdicionarEndereco}>+ Adicionar forma de pagamento</Text>
            </TouchableOpacity>
          ) : (
            formasPagamento.map((pag) => (
              <TouchableOpacity
                key={pag.id}
                style={[estilos.pagamentoCard, pagamentoSelecionado?.id === pag.id && estilos.selecionado]}
                onPress={() => setPagamentoSelecionado(pag)}
                activeOpacity={0.8}
              >
                <View style={estilos.radioOuter}>
                  {pagamentoSelecionado?.id === pag.id && <View style={estilos.radioInner} />}
                </View>
                <Text style={{ fontSize: 24, marginRight: 12 }}>{pag.icone || '💳'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.pagamentoNome}>
                    {pag.tipo} • {pag.bandeira}
                  </Text>
                  {pag.final ? (
                    <Text style={{ fontSize: 12, color: theme.cores.cinzaTexto, marginTop: 2 }}>
                      Final {pag.final}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity
            style={{ paddingVertical: 8, alignItems: 'center', marginTop: 4, marginBottom: theme.espacamento.sm }}
            onPress={() => navigation.navigate('Pagamentos')}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.cores.primaria, fontWeight: '600', fontSize: 14 }}>
              ⚙️ Gerenciar formas de pagamento
            </Text>
          </TouchableOpacity>

          {/* Seção: Resumo */}
          <Text style={[estilos.secaoTitulo, { marginTop: theme.espacamento.lg }]}>
            <Ionicons name="receipt-outline" size={18} color={theme.cores.primaria} /> Resumo do Pedido
          </Text>
          <View style={estilos.resumoCard}>
            {itensCarrinho.map((item) => (
              <View key={item.id} style={estilos.resumoItemContainer}>
                <View style={estilos.resumoItem}>
                  <Text style={estilos.resumoNome}>{item.quantidade}x {item.nome}</Text>
                  <Text style={estilos.resumoPreco}>{formatarMoeda(item.preco * item.quantidade)}</Text>
                </View>
                {item.observacao ? (
                  <Text style={estilos.resumoObservacao}>💬 {item.observacao}</Text>
                ) : null}
              </View>
            ))}
            
            <View style={estilos.divisor} />

            <View style={estilos.resumoItemTotalRow}>
              <Text style={estilos.resumoRotulo}>Subtotal</Text>
              <Text style={estilos.resumoValor}>{formatarMoeda(totalCarrinho)}</Text>
            </View>

            <View style={[estilos.resumoItemTotalRow, { marginTop: 6 }]}>
              <Text style={estilos.resumoRotulo}>Taxa de entrega</Text>
              <Text style={estilos.resumoValor}>
                {freteCarrinho > 0 ? formatarMoeda(freteCarrinho) : 'Grátis'}
              </Text>
            </View>

            <View style={estilos.divisor} />
            
            <View style={estilos.resumoItemTotal}>
              <Text style={estilos.resumoTotal}>Total</Text>
              <Text style={estilos.resumoTotalValor}>{formatarMoeda(totalCarrinho + freteCarrinho)}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Modal de Seleção de Endereço */}
      <Modal
        visible={modalEnderecosVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalEnderecosVisivel(false)}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modal}>
            <View style={estilos.modalHeader}>
              <Text style={estilos.modalTitulo}>Selecione o Endereço</Text>
              <TouchableOpacity onPress={() => setModalEnderecosVisivel(false)} style={estilos.botaoFecharModal} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color={theme.cores.textoEscuro} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={estilos.modalScrollView}>
              {enderecos.map((endereco) => (
                <TouchableOpacity
                  key={endereco.id}
                  style={[
                    estilos.enderecoCardModal,
                    enderecoSelecionado?.id === endereco.id && estilos.selecionadoModal
                  ]}
                  onPress={() => {
                    setEnderecoSelecionado(endereco);
                    setModalEnderecosVisivel(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={estilos.radioOuter}>
                    {enderecoSelecionado?.id === endereco.id && <View style={estilos.radioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.enderecoTexto}>{formatarEndereco(endereco)}</Text>
                    {endereco.principal ? <Text style={estilos.principal}>Principal</Text> : null}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={estilos.modalBotoesContainer}>
              <Botao
                titulo="⚙️ Gerenciar Endereços"
                variante="secundario"
                onPress={() => {
                  setModalEnderecosVisivel(false);
                  navigation.navigate('Enderecos');
                }}
                estilo={estilos.botaoGerenciarEnderecos}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Botão finalizar */}
      <View style={[estilos.footer, { paddingBottom: Math.max(insets.bottom, theme.espacamento.md) }]}>
        <Botao
          titulo={`Confirmar Pedido • ${formatarMoeda(totalCarrinho + freteCarrinho)}`}
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
  headerTitulo: { fontSize: theme.fonte.tamanho.xl, fontWeight: theme.fonte.peso.bold, color: theme.cores.branco },
  scroll: { padding: theme.espacamento.md, paddingBottom: theme.espacamento.xxl },
  secaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.espacamento.sm },
  secaoTitulo: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro, marginBottom: 0 },
  textoAlterar: { fontSize: theme.fonte.tamanho.sm, fontWeight: theme.fonte.peso.semibold, color: theme.cores.primaria },
  enderecoCardSelecionado: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md, padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm, borderWidth: 1.5, borderColor: theme.cores.cinzaMedio, ...theme.sombra.leve,
  },
  enderecoIconeContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8EDFA',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  enderecoTextoTitulo: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro },
  enderecoTextoSubtitulo: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto, marginTop: 2 },
  enderecoTextoComplemento: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.cinzaTexto, fontStyle: 'italic', marginTop: 1 },
  tagPrincipal: {
    alignSelf: 'flex-start', backgroundColor: '#E8F5E9', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 6,
  },
  tagPrincipalTexto: { fontSize: theme.fonte.tamanho.xs, color: theme.cores.sucesso, fontWeight: theme.fonte.peso.bold },
  enderecoCardModal: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cores.cinzaClaro,
    borderRadius: theme.borda.raio.md, padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm, borderWidth: 2, borderColor: 'transparent',
  },
  selecionadoModal: { borderColor: theme.cores.primaria, backgroundColor: theme.cores.branco },
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
    flexDirection: 'row',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.cores.primaria,
    borderRadius: theme.borda.raio.md, padding: theme.espacamento.md, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F9FAFC',
  },
  textoAdicionarEndereco: { color: theme.cores.primaria, fontWeight: theme.fonte.peso.semibold, fontSize: theme.fonte.tamanho.sm },
  pagamentoNome: { fontSize: theme.fonte.tamanho.md, color: theme.cores.textoEscuro },
  resumoCard: { backgroundColor: theme.cores.branco, borderRadius: theme.borda.raio.md, padding: theme.espacamento.md, ...theme.sombra.leve },
  resumoItemContainer: { marginBottom: theme.espacamento.sm },
  resumoItem: { flexDirection: 'row', justifyContent: 'space-between' },
  resumoObservacao: {
    fontSize: theme.fonte.tamanho.xs,
    fontStyle: 'italic',
    color: theme.cores.cinzaTexto,
    marginTop: 2,
    marginLeft: 18,
  },
  resumoItemTotal: { flexDirection: 'row', justifyContent: 'space-between' },
  resumoItemTotalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  resumoRotulo: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.cinzaTexto },
  resumoValor: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.textoEscuro },
  resumoNome: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.textoEscuro, flex: 1 },
  resumoPreco: { fontSize: theme.fonte.tamanho.sm, color: theme.cores.textoEscuro, fontWeight: theme.fonte.peso.medio },
  divisor: { height: 1, backgroundColor: theme.cores.cinzaMedio, marginVertical: theme.espacamento.sm },
  resumoTotal: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro },
  resumoTotalValor: { fontSize: theme.fonte.tamanho.md, fontWeight: theme.fonte.peso.bold, color: theme.cores.primaria },
  footer: { backgroundColor: theme.cores.branco, padding: theme.espacamento.md, borderTopWidth: 1, borderTopColor: theme.cores.cinzaMedio },
  botaoConfirmar: { width: '100%' },
  // Estilos do Modal
  modalOverlay: { flex: 1, backgroundColor: theme.cores.overlay, justifyContent: 'flex-end' },
  modal: {
    backgroundColor: theme.cores.branco, borderTopLeftRadius: theme.borda.raio.lg,
    borderTopRightRadius: theme.borda.raio.lg, padding: theme.espacamento.lg,
    maxHeight: '80%', ...theme.sombra.media,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.espacamento.md },
  modalTitulo: { fontSize: theme.fonte.tamanho.lg, fontWeight: theme.fonte.peso.bold, color: theme.cores.textoEscuro },
  botaoFecharModal: { padding: 4 },
  modalScrollView: { marginVertical: 10, maxHeight: 300 },
  modalBotoesContainer: { marginTop: theme.espacamento.md, borderTopWidth: 1, borderTopColor: theme.cores.cinzaMedio, paddingTop: theme.espacamento.md },
  botaoGerenciarEnderecos: { width: '100%' },
});

export default CheckoutScreen;
