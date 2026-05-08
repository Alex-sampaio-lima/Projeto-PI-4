// src/screens/conta/PagamentosScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';
import theme from '../../styles/theme';

export default function PagamentosScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // ID do método padrão
  const [metodoPadrao, setMetodoPadrao] = useState('1');

  const metodosSalvos = [
    { id: '1', tipo: 'Crédito', icone: '💳', final: '1234', bandeira: 'Visa' },
    { id: '2', tipo: 'Crédito', icone: '💳', final: '5678', bandeira: 'Mastercard' },
    { id: '3', tipo: 'PIX', icone: '💠', final: '', bandeira: 'Saldo na conta' },
  ];

  function handleNovoCartao() {
    Alert.alert(
      'Mercado Pago Checkout',
      'Por motivos de segurança PCI-DSS, a adição de novos cartões ocorre dinamicamente e com segurança apenas no momento do Checkout via Mercado Pago.'
    );
  }

  return (
    <View style={estilos.tela}>
      <Header titulo="Pagamentos" mostrarVoltar={true} />

      <ScrollView contentContainerStyle={[estilos.scroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={estilos.infoCard}>
          <Text style={estilos.infoIcone}>🛡️</Text>
          <Text style={estilos.infoTexto}>
            Seus dados estão protegidos. Nós não armazenamos as numerações do seu cartão. O processamento é feito integralmente pelo Mercado Pago.
          </Text>
        </View>

        <Text style={estilos.secaoTitulo}>Formas de pagamento salvas</Text>

        <View style={estilos.listaMetodos}>
          {metodosSalvos.map((metodo) => {
            const isSelecionado = metodoPadrao === metodo.id;

            return (
              <TouchableOpacity 
                key={metodo.id} 
                style={[estilos.cardMetodo, isSelecionado && estilos.cardSelecionado]}
                activeOpacity={0.7}
                onPress={() => setMetodoPadrao(metodo.id)}
              >
                <View style={estilos.metodoEsquerda}>
                  <Text style={estilos.metodoIcone}>{metodo.icone}</Text>
                  <View>
                    <Text style={estilos.metodoTitulo}>
                      {metodo.tipo} • {metodo.bandeira}
                    </Text>
                    {metodo.final ? (
                      <Text style={estilos.metodoSub}>Final {metodo.final}</Text>
                    ) : null}
                  </View>
                </View>
                
                {isSelecionado && (
                  <Text style={estilos.iconeCheck}>✅</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={estilos.botaoAdicionar} activeOpacity={0.8} onPress={handleNovoCartao}>
          <Text style={estilos.iconeAdicionar}>+</Text>
          <Text style={estilos.textoAdicionar}>Adicionar novo cartão</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
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
  },
  metodoEsquerda: {
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
  iconeCheck: {
    fontSize: 18,
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
});
