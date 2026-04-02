// src/context/CartContext.js
// Context global do carrinho — compartilha estado entre todas as telas

import React, { createContext, useState, useCallback } from 'react';
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
      await carrinhoService.adicionar(productId, quantidade);
      await buscarCarrinho();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error.message);
      throw error;
    }
  }, [buscarCarrinho]);

  // Remove item do carrinho
  const removerDoCarrinho = useCallback(async (itemId) => {
    try {
      await carrinhoService.removerItem(itemId);
      await buscarCarrinho();
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error.message);
    }
  }, [buscarCarrinho]);

  // Atualiza quantidade de um item
  const atualizarQuantidade = useCallback(async (itemId, quantidade) => {
    try {
      if (quantidade <= 0) {
        await removerDoCarrinho(itemId);
        return;
      }
      await carrinhoService.atualizarQuantidade(itemId, quantidade);
      await buscarCarrinho();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error.message);
    }
  }, [buscarCarrinho, removerDoCarrinho]);

  // Limpa o carrinho
  const limparCarrinho = useCallback(async () => {
    try {
      await carrinhoService.limpar();
      setItensCarrinho([]);
      setTotalCarrinho(0);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error.message);
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
