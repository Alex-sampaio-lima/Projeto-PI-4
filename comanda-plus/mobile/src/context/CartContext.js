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
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error.message);
      // Mantém estado atual em caso de erro
    } finally {
      setCarregando(false);
    }
  }, []);

  // Adiciona produto ao carrinho
  const adicionarAoCarrinho = useCallback(async (productId, quantidade = 1) => {
    try {
      // Usamos apenas o array de IDs para não congelar o app inteiro se houver vários cliques
      setAdicionandoIds((prev) => [...prev, productId]);
      await carrinhoService.adicionar(productId, quantidade);
      await buscarCarrinho();
      Alert.alert('✅ Adicionado ao Carrinho', 'O item foi adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error.message);
      Alert.alert('Erro', 'Não foi possível adicionar o item ao carrinho. Tente novamente.');
      throw error;
    } finally {
      setAdicionandoIds((prev) => prev.filter((id) => id !== productId));
    }
  }, [buscarCarrinho]);

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

  // Limpa o carrinho
  const limparCarrinho = useCallback(async () => {
    try {
      setCarregando(true);
      await carrinhoService.limpar();
      setItensCarrinho([]);
      setTotalCarrinho(0);
      Alert.alert('Tudo certo!', 'O carrinho foi esvaziado.');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error.message);
      Alert.alert('Erro', 'Não foi possível limpar o carrinho. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Quantidade total de itens no carrinho (para exibir no badge)
  const quantidadeTotalItens = itensCarrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  return (
    <CartContext.Provider
      value={{
        itensCarrinho,
        totalCarrinho,
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
