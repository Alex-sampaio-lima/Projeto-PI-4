// src/context/CartContext.js
// Context global do carrinho — compartilha estado entre todas as telas

import React, { createContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { carrinhoService } from '../services/endpoints';

// Cria o contexto
export const CartContext = createContext({});

/**
 * Provider do carrinho — envolve o app inteiro no App.js
 */
export function CartProvider({ children }) {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [totalCarrinho, setTotalCarrinho] = useState(0);
  const [freteCarrinho, setFreteCarrinho] = useState(0);
  const [carregando, setCarregando] = useState(false);
  // Lista de IDs de produtos que estão sendo adicionados no momento
  const [adicionandoIds, setAdicionandoIds] = useState([]);

  // Busca o carrinho atual da API
  const buscarCarrinho = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await carrinhoService.listar();
      const dados = resposta.data?.dados || resposta.data || {};
      setItensCarrinho(dados.itens || []);
      setTotalCarrinho(dados.total || 0);
      setFreteCarrinho(dados.frete || 0);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega o carrinho ao montar o componente
  React.useEffect(() => {
    buscarCarrinho();
  }, [buscarCarrinho]);

  // Limpa o carrinho
  const limparCarrinho = useCallback(async (mostrarAlerta = true) => {
    try {
      setCarregando(true);
      await carrinhoService.limpar();
      setItensCarrinho([]);
      setTotalCarrinho(0);
      setFreteCarrinho(0);
      if (mostrarAlerta) {
        Alert.alert('Tudo certo!', 'O carrinho foi esvaziado.');
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error.message);
      Alert.alert('Erro', 'Não foi possível limpar o carrinho. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Remove item do carrinho
  const removerDoCarrinho = useCallback(async (itemId) => {
    try {
      setCarregando(true);
      await carrinhoService.removerItem(itemId);
      await buscarCarrinho();
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error.message);
      Alert.alert('Erro', 'Não foi possível remover o item do carrinho.');
    } finally {
      setCarregando(false);
    }
  }, [buscarCarrinho]);

  // Adiciona produto ao carrinho
  const adicionarAoCarrinho = useCallback(async (produto, quantidade = 1, observacao = '') => {
    try {
      // Verifica se o carrinho já tem itens de outra empresa
      if (itensCarrinho.length > 0) {
        const empresaAtualId = itensCarrinho[0].product?.company_id || itensCarrinho[0].company_id;
        if (empresaAtualId && produto.company_id && empresaAtualId !== produto.company_id) {
          Alert.alert(
            'Limpar carrinho?',
            'Você só pode adicionar itens de uma loja por vez. Deseja esvaziar seu carrinho atual para adicionar este item?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Limpar e Adicionar', 
                onPress: async () => {
                  try {
                    setCarregando(true);
                    // 1. Limpa o carrinho no backend silenciosamente
                    await carrinhoService.limpar();
                    setItensCarrinho([]);
                    setTotalCarrinho(0);
                    setFreteCarrinho(0);

                    // 2. Adiciona o novo item imediatamente
                    setAdicionandoIds((prev) => [...prev, produto.id]);
                    await carrinhoService.adicionar(produto.id, quantidade, observacao);

                    // 3. Atualiza o estado local do carrinho
                    await buscarCarrinho();
                    Alert.alert('✅ Adicionado', `${produto.nome} foi adicionado ao seu pedido!`);
                  } catch (error) {
                    console.error('Erro ao limpar e adicionar:', error.message);
                    Alert.alert('Erro', 'Não foi possível adicionar o item. Tente novamente.');
                  } finally {
                    setAdicionandoIds((prev) => prev.filter((id) => id !== produto.id));
                    setCarregando(false);
                  }
                } 
              }
            ]
          );
          return;
        }
      }

      setAdicionandoIds((prev) => [...prev, produto.id]);
      await carrinhoService.adicionar(produto.id, quantidade, observacao);
      await buscarCarrinho();
      Alert.alert('✅ Adicionado', `${produto.nome} foi adicionado ao seu pedido!`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error.message);
      Alert.alert('Erro', 'Não foi possível adicionar o item. Tente novamente.');
      throw error;
    } finally {
      setAdicionandoIds((prev) => prev.filter((id) => id !== produto.id));
    }
  }, [buscarCarrinho, itensCarrinho, limparCarrinho]);

  // Atualiza quantidade de um item
  const atualizarQuantidade = useCallback(async (itemId, quantidade) => {
    try {
      setCarregando(true);
      if (quantidade <= 0) {
        await removerDoCarrinho(itemId);
        return;
      }
      await carrinhoService.atualizarQuantidade(itemId, quantidade);
      await buscarCarrinho();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error.message);
      Alert.alert('Erro', 'Não foi possível alterar a quantidade. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  }, [buscarCarrinho, removerDoCarrinho]);

  // Quantidade total de itens no carrinho (para exibir no badge)
  const quantidadeTotalItens = (itensCarrinho || []).reduce(
    (total, item) => total + (item.quantidade || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        itensCarrinho,
        totalCarrinho,
        freteCarrinho,
        carregando,
        adicionandoIds,
        quantidadeTotalItens,
        buscarCarrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
