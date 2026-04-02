// src/hooks/useCart.js
// Hook custom para consumir o CartContext de forma simples

import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Hook para acessar o carrinho em qualquer tela/componente
 * 
 * Exemplo de uso:
 *   const { itensCarrinho, adicionarAoCarrinho } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
}
