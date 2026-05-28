// src/screens/pedido/MeusPedidosScreen.js
// Tela de listagem e histórico de pedidos do usuário

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pedidosService } from '../../services/endpoints';
import { formatarMoeda, formatarData, formatarEndereco } from '../../utils/format';
import theme from '../../styles/theme';

const STATUS_CONFIG = {
  pendente: { texto: 'Pendente', corBg: '#FFF3E0', corTexto: '#F39C12', emoji: '⏳' },
  confirmado: { texto: 'Confirmado', corBg: '#E8F5E9', corTexto: '#27AE60', emoji: '✅' },
  em_preparo: { texto: 'Em Preparo', corBg: '#E3F2FD', corTexto: '#1A3FA1', emoji: '🍳' },
  a_caminho: { texto: 'A Caminho', corBg: '#E1F5FE', corTexto: '#0288D1', emoji: '🛵' },
  entregue: { texto: 'Entregue', corBg: '#E8F5E9', corTexto: '#27AE60', emoji: '🎉' },
  cancelado: { texto: 'Cancelado', corBg: '#FFEBEE', corTexto: '#E74C3C', emoji: '❌' },
};

function MeusPedidosScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // Armazena detalhes completos de pedidos carregados por ID
  const [detalhesPedidos, setDetalhesPedidos] = useState({});
  // ID do pedido atualmente expandido na listagem
  const [pedidoExpandidoId, setPedidoExpandidoId] = useState(null);
  // Estado para indicar que um detalhe específico está carregando
  const [carregandoDetalheId, setCarregandoDetalheId] = useState(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      const resposta = await pedidosService.listar();
      const lista = resposta.data?.dados || resposta.data || [];
      setPedidos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error('Erro ao carregar histórico de pedidos:', error.message);
      if (Platform.OS === 'web') {
        window.alert('Erro ao carregar seus pedidos. Tente novamente mais tarde.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar seus pedidos. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  async function handleRefresh() {
    setAtualizando(true);
    await carregarPedidos();
    setAtualizando(false);
  }

  async function toggleExpandirPedido(pedidoId) {
    if (pedidoExpandidoId === pedidoId) {
      setPedidoExpandidoId(null);
      return;
    }

    setPedidoExpandidoId(pedidoId);

    // Se os detalhes deste pedido ainda não foram carregados, carrega da API
    if (!detalhesPedidos[pedidoId]) {
      setCarregandoDetalheId(pedidoId);
      try {
        const resposta = await pedidosService.buscarPorId(pedidoId);
        const dadosCompletos = resposta.data?.dados || resposta.data;
        if (dadosCompletos) {
          setDetalhesPedidos((prev) => ({
            ...prev,
            [pedidoId]: dadosCompletos,
          }));
        }
      } catch (error) {
        console.error(`Erro ao carregar detalhes do pedido #${pedidoId}:`, error.message);
        setPedidoExpandidoId(null);
        if (Platform.OS === 'web') {
          window.alert('Erro ao carregar detalhes do pedido.');
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido.');
        }
      } finally {
        setCarregandoDetalheId(null);
      }
    }
  }

  function renderStatusBadge(status) {
    const config = STATUS_CONFIG[status] || { texto: status, corBg: '#F5F5F5', corTexto: '#888888', emoji: '📋' };
    return (
      <View style={[estilos.statusBadge, { backgroundColor: config.corBg }]}>
        <Text style={[estilos.statusTexto, { color: config.corTexto }]}>
          {config.emoji} {config.texto}
        </Text>
      </View>
    );
  }

  function renderItem({ item }) {
    const estaExpandido = pedidoExpandidoId === item.id;
    const detalhe = detalhesPedidos[item.id];
    const carregandoDetalhe = carregandoDetalheId === item.id;

    return (
      <View style={[estilos.card, estaExpandido && estilos.cardExpandido]}>
        {/* Cabeçalho do Card */}
        <TouchableOpacity
          style={estilos.cardHeader}
          onPress={() => toggleExpandirPedido(item.id)}
          activeOpacity={0.8}
        >
          <View style={estilos.headerEsq}>
            <Text style={estilos.pedidoId}>Pedido #{item.id}</Text>
            <Text style={estilos.pedidoData}>{formatarData(item.created_at)}</Text>
          </View>
          <View style={estilos.headerDir}>
            <Ionicons
              name={estaExpandido ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.cores.cinzaTexto}
            />
          </View>
        </TouchableOpacity>

        {/* Informações Resumidas do Card */}
        <View style={estilos.cardResumo}>
          <View style={estilos.resumoLinha}>
            <View style={estilos.lojaContainer}>
              <Text style={estilos.lojaEmoji}>🏢</Text>
              <Text style={estilos.lojaNome}>{item.empresa_nome || 'Comanda+ Restaurante'}</Text>
            </View>
            <Text style={estilos.pedidoValor}>{formatarMoeda(item.total)}</Text>
          </View>
          <View style={estilos.resumoLinhaStatus}>
            {renderStatusBadge(item.status)}
          </View>
        </View>

        {/* Detalhes Expandidos (Accordion) */}
        {estaExpandido && (
          <View style={estilos.divisorCard}>
            {carregandoDetalhe ? (
              <View style={estilos.detalheLoading}>
                <ActivityIndicator color={theme.cores.primaria} size="small" />
                <Text style={estilos.textoLoadingDetalhe}>Carregando itens...</Text>
              </View>
            ) : detalhe ? (
              <View style={estilos.detalheContainer}>
                {/* Lista de Itens do Pedido */}
                <Text style={estilos.detalheSecaoTitulo}>Itens do Pedido</Text>
                {detalhe.itens && detalhe.itens.length > 0 ? (
                  detalhe.itens.map((subItem) => (
                    <View key={subItem.id} style={estilos.itemPedido}>
                      <Text style={estilos.itemQtdNome}>
                        {subItem.quantidade}x {subItem.produto_nome}
                      </Text>
                      <Text style={estilos.itemPreco}>
                        {formatarMoeda(subItem.preco_unitario * subItem.quantidade)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={estilos.textoInformativo}>Nenhum item encontrado.</Text>
                )}

                {/* Endereço de Entrega */}
                {(detalhe.rua || detalhe.rua_entrega) ? (
                  <>
                    <View style={estilos.divisorInterno} />
                    <Text style={estilos.detalheSecaoTitulo}>Endereço de Entrega</Text>
                    <Text style={estilos.enderecoTexto}>
                      📍 {formatarEndereco({
                        rua: detalhe.rua || detalhe.rua_entrega,
                        numero: detalhe.numero,
                        complemento: detalhe.complemento,
                        bairro: detalhe.bairro,
                        cidade: detalhe.cidade,
                        estado: detalhe.estado,
                      })}
                    </Text>
                  </>
                ) : null}

                {/* Observações */}
                {detalhe.observacao ? (
                  <>
                    <View style={estilos.divisorInterno} />
                    <Text style={estilos.detalheSecaoTitulo}>Observações</Text>
                    <Text style={estilos.observacaoTexto}>💬 {detalhe.observacao}</Text>
                  </>
                ) : null}
              </View>
            ) : (
              <Text style={estilos.textoErroDetalhe}>Erro ao carregar detalhes do pedido.</Text>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <View style={[estilos.header, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={estilos.botaoVoltar}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={theme.cores.branco} />
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Meus Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      {carregando ? (
        <View style={estilos.telaCentrada}>
          <ActivityIndicator size="large" color={theme.cores.primaria} />
          <Text style={estilos.textoLoading}>Buscando seu histórico...</Text>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={estilos.telaCentrada}>
          <View style={estilos.emptyIconeContainer}>
            <Text style={estilos.emptyIcone}>📋</Text>
          </View>
          <Text style={estilos.emptyTitulo}>Nenhum pedido feito</Text>
          <Text style={estilos.emptySubtitulo}>
            Seus pedidos finalizados aparecerão aqui. Que tal fazer sua primeira compra?
          </Text>
          <TouchableOpacity
            style={estilos.botaoIrCardapio}
            onPress={() => navigation.navigate('Produtos')}
            activeOpacity={0.8}
          >
            <Text style={estilos.botaoIrCardapioTexto}>Ver Cardápio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={handleRefresh}
              colors={[theme.cores.primaria]}
              tintColor={theme.cores.primaria}
            />
          }
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.cores.cinzaClaro },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.cores.primaria,
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
  },
  botaoVoltar: { width: 40, alignItems: 'flex-start' },
  headerTitulo: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
  },
  telaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.espacamento.lg,
  },
  textoLoading: {
    marginTop: theme.espacamento.md,
    color: theme.cores.cinzaTexto,
    fontSize: theme.fonte.tamanho.md,
  },
  emptyIconeContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borda.raio.full,
    backgroundColor: theme.cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.espacamento.lg,
    ...theme.sombra.leve,
  },
  emptyIcone: { fontSize: 44 },
  emptyTitulo: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.sm,
  },
  emptySubtitulo: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.cinzaTexto,
    textAlign: 'center',
    marginBottom: theme.espacamento.xl,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  botaoIrCardapio: {
    backgroundColor: theme.cores.primaria,
    paddingVertical: 14,
    paddingHorizontal: theme.espacamento.xl,
    borderRadius: theme.borda.raio.md,
    ...theme.sombra.leve,
  },
  botaoIrCardapioTexto: {
    color: theme.cores.branco,
    fontWeight: theme.fonte.peso.bold,
    fontSize: theme.fonte.tamanho.md,
  },
  lista: { padding: theme.espacamento.md, paddingBottom: theme.espacamento.xxl },
  card: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    marginBottom: theme.espacamento.md,
    borderWidth: 1,
    borderColor: theme.cores.cinzaMedio,
    overflow: 'hidden',
    ...theme.sombra.leve,
  },
  cardExpandido: {
    borderColor: theme.cores.primaria,
    ...theme.sombra.media,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.espacamento.md,
    backgroundColor: theme.cores.cinzaClaro,
    borderBottomWidth: 1,
    borderBottomColor: theme.cores.cinzaMedio,
  },
  headerEsq: { flexDirection: 'row', alignItems: 'center', gap: theme.espacamento.sm },
  pedidoId: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
  },
  pedidoData: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
  },
  headerDir: { width: 30, alignItems: 'flex-end' },
  cardResumo: { padding: theme.espacamento.md },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lojaContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lojaEmoji: { fontSize: 16 },
  lojaNome: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
  },
  pedidoValor: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.primaria,
  },
  resumoLinhaStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: theme.espacamento.sm,
    paddingVertical: 4,
    borderRadius: theme.borda.raio.full,
  },
  statusTexto: {
    fontSize: theme.fonte.tamanho.xs,
    fontWeight: theme.fonte.peso.bold,
  },
  divisorCard: {
    borderTopWidth: 1,
    borderTopColor: theme.cores.cinzaMedio,
    backgroundColor: '#FAFAFA',
  },
  detalheLoading: {
    padding: theme.espacamento.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.espacamento.sm,
  },
  textoLoadingDetalhe: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
  },
  detalheContainer: {
    padding: theme.espacamento.md,
  },
  detalheSecaoTitulo: {
    fontSize: theme.fonte.tamanho.xs,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.cinzaTexto,
    letterSpacing: 0.5,
    marginBottom: theme.espacamento.xs,
    textTransform: 'uppercase',
  },
  itemPedido: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  itemQtdNome: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.textoEscuro,
  },
  itemPreco: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.textoEscuro,
    fontWeight: theme.fonte.peso.medio,
  },
  divisorInterno: {
    height: 1,
    backgroundColor: theme.cores.cinzaMedio,
    marginVertical: theme.espacamento.md,
  },
  enderecoTexto: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.textoEscuro,
    lineHeight: 18,
  },
  observacaoTexto: {
    fontSize: theme.fonte.tamanho.sm,
    fontStyle: 'italic',
    color: theme.cores.cinzaTexto,
    lineHeight: 18,
  },
  textoInformativo: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
    fontStyle: 'italic',
  },
  textoErroDetalhe: {
    padding: theme.espacamento.md,
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.erro,
    textAlign: 'center',
  },
});

export default MeusPedidosScreen;
