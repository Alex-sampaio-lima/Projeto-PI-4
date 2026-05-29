// src/screens/home/RestaurantesScreen.js
// Tela principal que lista os restaurantes (empresas) — Estilo iFood

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, FlatList, TextInput, Dimensions,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { empresasService, categoriasService } from '../../services/endpoints';
import CardRestaurante from '../../components/restaurante/CardRestaurante';
import CategoriaItem from '../../components/produto/CategoriaItem';
import theme from '../../styles/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: LARGURA_TELA } = Dimensions.get('window');

function RestaurantesScreen() {
  const navigation = useNavigation();
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const insets = useSafeAreaInsets();

  const { width: larguraTela } = useWindowDimensions();
  const isWeb = larguraTela > 768;
  const larguraBanner = isWeb ? 580 : larguraTela - 32;

  const totalBanners = 3;
  const scrollRef = useRef(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  useEffect(() => {
    if (totalBanners <= 1) return;

    const timer = setInterval(() => {
      const proximoIndice = (indiceAtivo + 1) % totalBanners;
      const passo = larguraBanner + 16;
      scrollRef.current?.scrollTo({
        x: proximoIndice * passo,
        animated: true,
      });
      setIndiceAtivo(proximoIndice);
    }, 4000);

    return () => clearInterval(timer);
  }, [indiceAtivo, larguraBanner]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const passo = larguraBanner + 16;
    const indice = Math.round(offsetX / passo);
    if (indice !== indiceAtivo && indice >= 0 && indice < totalBanners) {
      setIndiceAtivo(indice);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    carregarEmpresas();
  }, [categoriaSelecionada]);

  async function carregarDadosIniciais() {
    try {
      const respCats = await categoriasService.listar();
      const dadosCats = respCats.data?.dados || respCats.data || [];
      setCategorias(dadosCats);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error.message);
    }
  }

  async function carregarEmpresas() {
    try {
      setCarregando(true);
      const respEmp = await empresasService.listar(categoriaSelecionada?.nome);
      const dadosEmp = respEmp.data?.dados || respEmp.data || [];
      setEmpresas(dadosEmp);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error.message);
    } finally {
      setCarregando(false);
    }
  }

  function handleSelecionarCategoria(cat) {
    if (categoriaSelecionada?.id === cat.id) {
      setCategoriaSelecionada(null);
    } else {
      setCategoriaSelecionada(cat);
    }
  }

  // Filtra restaurantes com base na busca
  const empresasFiltradas = empresas.filter((emp) =>
    emp.nome.toLowerCase().includes(busca.toLowerCase()) ||
    emp.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={estilos.tela}>
      {/* Header Fixo com Busca integrada */}
      <View style={[estilos.header, { paddingTop: Math.max(insets.top + 10, theme.espacamento.xl) }]}>
        <View style={estilos.headerTop}>
          <View>
            <Text style={estilos.saudacao}>Olá! 👋</Text>
            <Text style={estilos.pergunta}>Qual restaurante hoje?</Text>
          </View>
          <TouchableOpacity
            style={estilos.iconePerfil}
            onPress={() => navigation.navigate('Conta')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle-outline" size={28} color={theme.cores.branco} />
          </TouchableOpacity>
        </View>

        {/* Barra de Busca de Lojas */}
        <View style={estilos.campoBusca}>
          <Ionicons name="search-outline" size={18} color="rgba(255, 255, 255, 0.7)" style={{ marginRight: 6 }} />
          <TextInput
            style={estilos.inputBusca}
            placeholder="Buscar restaurante ou categoria..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={16} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrossel de Banners de Promoção */}
        <View style={[estilos.carrosselContainer, isWeb && { alignSelf: 'center', width: larguraBanner }]}>
          <ScrollView 
            ref={scrollRef}
            horizontal 
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.carrosselScroll}
            onMomentumScrollEnd={handleScroll}
          >
            {/* Card 1 */}
            <TouchableOpacity 
              style={[estilos.bannerCard, { backgroundColor: '#F4A62A', width: larguraBanner }]} 
              activeOpacity={0.9}
            >
              <View style={estilos.bannerTexto}>
                <Text style={estilos.bannerTag}>🔥 PROMOÇÃO</Text>
                <Text style={estilos.bannerTitulo}>Comanda+ Especial</Text>
                <Text style={estilos.bannerSubtitulo}>Até 50% de desconto nos pratos selecionados</Text>
              </View>
              <Text style={estilos.bannerEmoji}>🍔</Text>
            </TouchableOpacity>

            {/* Card 2 */}
            <TouchableOpacity 
              style={[estilos.bannerCard, { backgroundColor: '#1A3FA1', width: larguraBanner }]} 
              activeOpacity={0.9}
            >
              <View style={estilos.bannerTexto}>
                <Text style={estilos.bannerTag}>🚚 FRETE ZERO</Text>
                <Text style={estilos.bannerTitulo}>Entrega Grátis</Text>
                <Text style={estilos.bannerSubtitulo}>Hoje o frete é por nossa conta nas principais lojas</Text>
              </View>
              <Text style={estilos.bannerEmoji}>🍕</Text>
            </TouchableOpacity>

            {/* Card 3 */}
            <TouchableOpacity 
              style={[estilos.bannerCard, { backgroundColor: '#27AE60', width: larguraBanner }]} 
              activeOpacity={0.9}
            >
              <View style={estilos.bannerTexto}>
                <Text style={estilos.bannerTag}>⚡ RÁPIDO</Text>
                <Text style={estilos.bannerTitulo}>Entrega Flash</Text>
                <Text style={estilos.bannerSubtitulo}>Seu pedido entregue quentinho em até 25 minutos</Text>
              </View>
              <Text style={estilos.bannerEmoji}>🥗</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Indicadores de Página (Dots) */}
          <View style={estilos.indicadoresContainer}>
            {[...Array(totalBanners)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  estilos.indicador, 
                  indiceAtivo === i ? estilos.indicadorAtivo : estilos.indicadorInativo
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Categorias */}
        <View style={estilos.secaoCategorias}>
          <Text style={estilos.secaoTitulo}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.listaCategorias}>
            <CategoriaItem
              categoria={{ id: null, nome: 'Todos', icone: '🍽️' }}
              selecionada={categoriaSelecionada === null}
              onPress={() => setCategoriaSelecionada(null)}
            />
            {categorias.map((item) => (
              <CategoriaItem
                key={item.id}
                categoria={item}
                selecionada={categoriaSelecionada?.id === item.id}
                onPress={() => handleSelecionarCategoria(item)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Lista de Restaurantes */}
        <View style={estilos.secaoLojas}>
          <Text style={estilos.secaoTitulo}>Lojas Disponíveis</Text>
          {carregando ? (
            <ActivityIndicator color={theme.cores.primaria} size="large" style={{ marginTop: 40 }} />
          ) : empresasFiltradas.length > 0 ? (
            empresasFiltradas.map((emp) => (
              <CardRestaurante
                key={emp.id}
                empresa={emp}
                onPress={() => navigation.navigate('CardapioLoja', { empresa: emp })}
              />
            ))
          ) : (
            <View style={estilos.vazio}>
              <Text style={estilos.textoVazio}>Nenhum restaurante encontrado.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.cores.cinzaClaro,
  },
  header: {
    paddingHorizontal: theme.espacamento.md,
    paddingTop: theme.espacamento.xl,
    paddingBottom: theme.espacamento.md,
    backgroundColor: theme.cores.primaria,
    borderBottomLeftRadius: theme.borda.raio.lg,
    borderBottomRightRadius: theme.borda.raio.lg,
    ...theme.sombra.leve,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.espacamento.sm,
  },
  campoBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: theme.borda.raio.md,
    paddingHorizontal: theme.espacamento.sm,
    marginTop: 4,
  },
  inputBusca: {
    flex: 1,
    paddingVertical: 8,
    fontSize: theme.fonte.tamanho.md,
    color: theme.cores.branco,
  },
  carrosselContainer: {
    marginTop: theme.espacamento.md,
  },
  carrosselScroll: {
    paddingHorizontal: theme.espacamento.md,
    gap: 16,
  },
  bannerCard: {
    borderRadius: theme.borda.raio.lg,
    padding: theme.espacamento.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    ...theme.sombra.leve,
  },
  bannerTexto: {
    flex: 1,
    marginRight: theme.espacamento.sm,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borda.raio.sm,
    alignSelf: 'flex-start',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  bannerTitulo: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
    marginBottom: 4,
  },
  bannerSubtitulo: {
    fontSize: theme.fonte.tamanho.xs,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bannerEmoji: {
    fontSize: 54,
    marginLeft: theme.espacamento.sm,
  },
  indicadoresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  indicador: {
    height: 6,
    borderRadius: 3,
  },
  indicadorAtivo: {
    width: 16,
    backgroundColor: theme.cores.primaria,
  },
  indicadorInativo: {
    width: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  saudacao: {
    fontSize: theme.fonte.tamanho.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  pergunta: {
    fontSize: theme.fonte.tamanho.xl,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.branco,
  },
  iconePerfil: {
    width: 42,
    height: 42,
    borderRadius: theme.borda.raio.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secaoCategorias: {
    paddingTop: theme.espacamento.lg,
  },
  secaoTitulo: {
    fontSize: theme.fonte.tamanho.lg,
    fontWeight: theme.fonte.peso.bold,
    color: theme.cores.textoEscuro,
    paddingHorizontal: theme.espacamento.md,
    marginBottom: theme.espacamento.sm,
  },
  listaCategorias: {
    paddingHorizontal: theme.espacamento.md,
    paddingBottom: theme.espacamento.md,
  },
  secaoLojas: {
    paddingHorizontal: theme.espacamento.md,
    paddingBottom: theme.espacamento.xl,
  },
  vazio: {
    alignItems: 'center',
    marginTop: 40,
  },
  textoVazio: {
    color: theme.cores.cinzaTexto,
    textAlign: 'center',
  },
});

export default RestaurantesScreen;
