// src/screens/conta/PagamentosScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
  ActivityIndicator, Modal, TextInput, Platform, Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';
import Botao from '../../components/ui/Botao';
import { formasPagamentoService } from '../../services/endpoints';
import theme from '../../styles/theme';

export default function PagamentosScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [metodos, setMetodos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [metodoEmEdicao, setMetodoEmEdicao] = useState(null);

  // Campos do formulário
  const [tipo, setTipo] = useState('Crédito'); // Crédito, Débito, PIX, Dinheiro
  const [bandeira, setBandeira] = useState('');
  const [final, setFinal] = useState('');
  const [principal, setPrincipal] = useState(false);

  useEffect(() => {
    carregarMetodos();
  }, []);

  async function carregarMetodos() {
    try {
      const resposta = await formasPagamentoService.listar();
      const dados = resposta.data?.dados || resposta.data || [];
      setMetodos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleDefinirPrincipal(metodo) {
    if (metodo.principal) return; // Já é o padrão
    
    try {
      setCarregando(true);
      await formasPagamentoService.atualizar(metodo.id, {
        ...metodo,
        principal: 1
      });
      await carregarMetodos();
    } catch (error) {
      console.error('Erro ao definir método padrão:', error.message);
      if (Platform.OS === 'web') {
        window.alert('Não foi possível definir como padrão.');
      } else {
        Alert.alert('Erro', 'Não foi possível definir como padrão.');
      }
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar() {
    if (!tipo || !bandeira) {
      if (Platform.OS === 'web') {
        window.alert('Atenção: Preencha todos os campos obrigatórios (Tipo e Bandeira/Instituição).');
      } else {
        Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (Tipo e Bandeira/Instituição).');
      }
      return;
    }

    // Validação opcional: se for cartão, ideal ter os 4 dígitos
    if ((tipo === 'Crédito' || tipo === 'Débito') && final && final.length !== 4) {
      if (Platform.OS === 'web') {
        window.alert('Atenção: O final do cartão deve ter exatamente 4 dígitos.');
      } else {
        Alert.alert('Atenção', 'O final do cartão deve ter exatamente 4 dígitos.');
      }
      return;
    }

    setSalvando(true);

    // Mapeamento automático de ícones com base no tipo
    let icone = '💳';
    if (tipo === 'PIX') icone = '💠';
    if (tipo === 'Dinheiro') icone = '💵';
    if (tipo === 'Mercado Pago') icone = '🔵';

    const payload = {
      tipo,
      bandeira,
      final: tipo === 'PIX' || tipo === 'Dinheiro' || tipo === 'Mercado Pago' ? '' : final,
      icone,
      principal: principal ? 1 : 0
    };

    try {
      if (metodoEmEdicao) {
        await formasPagamentoService.atualizar(metodoEmEdicao, payload);
      } else {
        await formasPagamentoService.criar(payload);
      }

      setModalVisivel(false);
      setMetodoEmEdicao(null);
      limparFormulario();
      await carregarMetodos();
    } catch (error) {
      console.error('Erro ao salvar método:', error.message);
      if (Platform.OS === 'web') {
        window.alert(`Erro: Não foi possível salvar o método de pagamento. ${error.message}`);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o método de pagamento.');
      }
    } finally {
      setSalvando(false);
    }
  }

  function handleEditar(metodo) {
    setTipo(metodo.tipo);
    setBandeira(metodo.bandeira);
    setFinal(metodo.final || '');
    setPrincipal(!!metodo.principal);
    setMetodoEmEdicao(metodo.id);
    setModalVisivel(true);
  }

  async function handleRemover(id) {
    if (Platform.OS === 'web') {
      const confirmou = window.confirm('Tem certeza que deseja remover esta forma de pagamento?');
      if (confirmou) {
        try {
          await formasPagamentoService.remover(id);
          await carregarMetodos();
        } catch (error) {
          console.error(error);
          window.alert(`Não foi possível remover. Motivo: ${error.message}`);
        }
      }
    } else {
      Alert.alert(
        'Remover Pagamento',
        'Tem certeza que deseja remover esta forma de pagamento?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                await formasPagamentoService.remover(id);
                await carregarMetodos();
              } catch (error) {
                console.error(error);
                Alert.alert('Erro', `Não foi possível remover. Motivo: ${error.message}`);
              }
            },
          },
        ]
      );
    }
  }

  function abrirModalCriar() {
    limparFormulario();
    setMetodoEmEdicao(null);
    setModalVisivel(true);
  }

  function limparFormulario() {
    setTipo('Crédito');
    setBandeira('');
    setFinal('');
    setPrincipal(false);
  }

  return (
    <View style={estilos.tela}>
      <Header titulo="Pagamentos" mostrarVoltar={true} />

      {carregando ? (
        <View style={estilos.carregandoContainer}>
          <ActivityIndicator color={theme.cores.primaria} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={[estilos.scroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
          <View style={estilos.infoCard}>
            <Text style={estilos.infoIcone}>🛡️</Text>
            <Text style={estilos.infoTexto}>
              Seus dados estão protegidos. Você pode cadastrar e gerenciar suas formas de pagamento locais para facilitar os seus pedidos no Comanda+.
            </Text>
          </View>

          <Text style={estilos.secaoTitulo}>Minhas formas de pagamento</Text>

          <View style={estilos.listaMetodos}>
            {metodos.length === 0 ? (
              <View style={estilos.vazio}>
                <Text style={estilos.emojiVazio}>💳</Text>
                <Text style={estilos.textoVazio}>Nenhuma forma de pagamento cadastrada</Text>
              </View>
            ) : (
              metodos.map((metodo) => {
                const isSelecionado = !!metodo.principal;

                return (
                  <View 
                    key={metodo.id} 
                    style={[estilos.cardMetodo, isSelecionado && estilos.cardSelecionado]}
                  >
                    <TouchableOpacity 
                      style={estilos.metodoEsquerda}
                      activeOpacity={0.7}
                      onPress={() => handleDefinirPrincipal(metodo)}
                    >
                      <Text style={estilos.metodoIcone}>{metodo.icone || '💳'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={estilos.metodoTitulo}>
                          {metodo.tipo} • {metodo.bandeira}
                        </Text>
                        {metodo.final ? (
                          <Text style={estilos.metodoSub}>Final {metodo.final}</Text>
                        ) : null}
                        {isSelecionado ? (
                          <Text style={estilos.badgePadrao}>⭐ Padrão</Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    
                    <View style={estilos.botoesAcao}>
                      <TouchableOpacity onPress={() => handleEditar(metodo)} style={estilos.botaoAcao} activeOpacity={0.7}>
                        <Text style={estilos.textoBotaoAcao}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleRemover(metodo.id)} style={estilos.botaoAcao} activeOpacity={0.7}>
                        <Text style={estilos.textoBotaoAcao}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          <TouchableOpacity style={estilos.botaoAdicionar} activeOpacity={0.8} onPress={abrirModalCriar}>
            <Text style={estilos.iconeAdicionar}>+</Text>
            <Text style={estilos.textoAdicionar}>Adicionar forma de pagamento</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal para Adicionar / Editar */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modal}>
            <Text style={estilos.modalTitulo}>
              {metodoEmEdicao ? 'Editar Pagamento' : 'Novo Pagamento'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {/* Seleção do Tipo */}
              <Text style={estilos.labelModal}>Tipo de Pagamento</Text>
              <View style={estilos.tipoSelector}>
                {['Crédito', 'Débito', 'PIX', 'Dinheiro', 'Mercado Pago'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[estilos.tipoOpcao, tipo === t && estilos.tipoOpcaoSelecionada]}
                    onPress={() => setTipo(t)}
                  >
                    <Text style={[estilos.tipoOpcaoTexto, tipo === t && estilos.tipoOpcaoTextoSelecionada]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bandeira / Instituição */}
              <Text style={estilos.labelModal}>Bandeira / Instituição</Text>
              <TextInput
                style={estilos.inputModal}
                placeholder={tipo === 'PIX' || tipo === 'Dinheiro' || tipo === 'Mercado Pago' ? 'Ex: Mercado Pago, Nubank, Carteira' : 'Ex: Visa, Mastercard, Elo'}
                placeholderTextColor={theme.cores.cinzaTexto}
                value={bandeira}
                onChangeText={setBandeira}
              />

              {/* Últimos 4 dígitos (Se aplicável) */}
              {(tipo === 'Crédito' || tipo === 'Débito') && (
                <View>
                  <Text style={estilos.labelModal}>Últimos 4 Dígitos do Cartão</Text>
                  <TextInput
                    style={estilos.inputModal}
                    placeholder="Ex: 1234"
                    placeholderTextColor={theme.cores.cinzaTexto}
                    value={final}
                    onChangeText={setFinal}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              )}

              {/* Toggle Principal */}
              <View style={estilos.switchContainer}>
                <Text style={estilos.labelModal}>Definir como forma padrão</Text>
                <Switch
                  value={principal}
                  onValueChange={setPrincipal}
                  trackColor={{ false: theme.cores.cinzaMedio, true: theme.cores.primaria }}
                  thumbColor={Platform.OS === 'android' ? (principal ? theme.cores.primaria : '#f4f3f4') : ''}
                />
              </View>
            </ScrollView>

            <View style={estilos.modalBotoes}>
              <Botao titulo="Cancelar" variante="secundario" onPress={() => setModalVisivel(false)} estilo={estilos.botaoModal} />
              <Botao titulo="Salvar" onPress={handleSalvar} carregando={salvando} estilo={estilos.botaoModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: theme.espacamento.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F6F3',
    padding: theme.espacamento.md,
    borderRadius: theme.borda.raio.md,
    marginBottom: theme.espacamento.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A3E4D7'
  },
  infoIcone: {
    fontSize: 24,
    marginRight: theme.espacamento.sm,
  },
  infoTexto: {
    flex: 1,
    fontSize: theme.fonte.tamanho.sm,
    color: '#117A65',
    lineHeight: 20,
  },
  secaoTitulo: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.sm,
  },
  listaMetodos: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    overflow: 'hidden',
    ...theme.sombra.leve,
    marginBottom: theme.espacamento.xl,
  },
  cardMetodo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.espacamento.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.cores.cinzaClaro,
  },
  cardSelecionado: {
    backgroundColor: '#F8F9F9',
    borderLeftWidth: 3,
    borderLeftColor: theme.cores.primaria,
  },
  metodoEsquerda: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metodoIcone: {
    fontSize: 24,
    marginRight: theme.espacamento.md,
  },
  metodoTitulo: {
    fontSize: theme.fonte.tamanho.md,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
  },
  metodoSub: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.cinzaTexto,
    marginTop: 2,
  },
  badgePadrao: {
    fontSize: theme.fonte.tamanho.xs,
    color: theme.cores.primaria,
    fontWeight: theme.fonte.peso.bold,
    marginTop: 4,
  },
  botoesAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.espacamento.sm,
  },
  botaoAcao: {
    padding: 6,
  },
  textoBotaoAcao: {
    fontSize: 18,
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: theme.espacamento.xxl,
  },
  emojiVazio: {
    fontSize: 40,
    marginBottom: theme.espacamento.sm,
  },
  textoVazio: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.cinzaTexto,
  },
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.espacamento.md,
    backgroundColor: theme.cores.branco,
    borderRadius: theme.borda.raio.md,
    borderWidth: 1,
    borderColor: theme.cores.primaria,
    borderStyle: 'dashed',
  },
  iconeAdicionar: {
    fontSize: 24,
    color: theme.cores.primaria,
    marginRight: theme.espacamento.sm,
    fontWeight: theme.fonte.peso.bold,
  },
  textoAdicionar: {
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.primaria,
    fontWeight: theme.fonte.peso.semibold,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.cores.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.cores.branco,
    borderTopLeftRadius: theme.borda.raio.xl,
    borderTopRightRadius: theme.borda.raio.xl,
    padding: theme.espacamento.lg,
    maxHeight: '90%',
  },
  modalTitulo: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.md,
  },
  labelModal: {
    fontSize: theme.fonte.tamanho.sm,
    fontWeight: theme.fonte.peso.semibold,
    color: theme.cores.textoEscuro,
    marginBottom: 6,
    marginTop: theme.espacamento.sm,
  },
  inputModal: {
    backgroundColor: theme.cores.cinzaClaro,
    borderWidth: 1,
    borderColor: theme.cores.cinzaMedio,
    borderRadius: theme.borda.raio.md,
    paddingHorizontal: theme.espacamento.md,
    paddingVertical: 10,
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.textoEscuro,
    marginBottom: theme.espacamento.sm,
  },
  tipoSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.espacamento.md,
  },
  tipoOpcao: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: theme.cores.cinzaClaro,
    borderWidth: 1,
    borderColor: theme.cores.cinzaMedio,
    borderRadius: theme.borda.raio.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoOpcaoSelecionada: {
    backgroundColor: theme.cores.primaria,
    borderColor: theme.cores.primaria,
  },
  tipoOpcaoTexto: {
    fontSize: theme.fonte.tamanho.sm,
    color: theme.cores.textoEscuro,
    fontWeight: theme.fonte.peso.semibold,
  },
  tipoOpcaoTextoSelecionada: {
    color: theme.cores.branco,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.espacamento.sm,
    marginBottom: theme.espacamento.lg,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: theme.espacamento.sm,
    marginTop: theme.espacamento.sm,
  },
  botaoModal: {
    flex: 1,
  },
});
