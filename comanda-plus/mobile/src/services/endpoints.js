// src/services/endpoints.js
// Funções que encapsulam as chamadas a cada endpoint da API

import api from './api';

// ===== Produtos ===== //
export const produtosService = {
  // Busca todos os produtos (opcional: filtrar por categoria)
  listar: (categoryId) => {
    const params = categoryId ? { category_id: categoryId } : {};
    return api.get('/products', { params });
  },

  // Busca um produto pelo ID
  buscarPorId: (id) => api.get(`/products/${id}`),

  // Cria um produto
  criar: (dados) => api.post('/products', dados),

  // Atualiza um produto
  atualizar: (id, dados) => api.put(`/products/${id}`, dados),

  // Remove um produto
  remover: (id) => api.delete(`/products/${id}`),
};

// ===== Categorias ===== //
export const categoriasService = {
  listar: () => api.get('/categories'),
  buscarPorId: (id) => api.get(`/categories/${id}`),
  criar: (dados) => api.post('/categories', dados),
  atualizar: (id, dados) => api.put(`/categories/${id}`, dados),
  remover: (id) => api.delete(`/categories/${id}`),
};

// ===== Carrinho ===== //
export const carrinhoService = {
  // Busca todos os itens do carrinho
  listar: () => api.get('/cart'),

  // Adiciona produto ao carrinho
  adicionar: (productId, quantidade = 1) =>
    api.post('/cart', { product_id: productId, quantidade }),

  // Atualiza quantidade de um item
  atualizarQuantidade: (itemId, quantidade) =>
    api.put(`/cart/${itemId}`, { quantidade }),

  // Remove item específico
  removerItem: (itemId) => api.delete(`/cart/${itemId}`),

  // Limpa o carrinho inteiro
  limpar: () => api.delete('/cart/clear'),
};

// ===== Pedidos ===== //
export const pedidosService = {
  listar: () => api.get('/orders'),
  buscarPorId: (id) => api.get(`/orders/${id}`),

  // Cria pedido a partir do carrinho atual
  criar: (dados) => api.post('/orders', dados),

  // Atualiza status do pedido
  atualizarStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),

  remover: (id) => api.delete(`/orders/${id}`),
};

// ===== Endereços ===== //
export const enderecosService = {
  listar: () => api.get('/addresses'),
  buscarPorId: (id) => api.get(`/addresses/${id}`),
  criar: (dados) => api.post('/addresses', dados),
  atualizar: (id, dados) => api.put(`/addresses/${id}`, dados),
  remover: (id) => api.delete(`/addresses/${id}`),
};

// ===== Autenticação ===== //
export const authService = {
  // Cadastra novo usuário
  cadastrar: (dados) => api.post('/auth/register', dados),

  // Faz login
  login: (dados) => api.post('/auth/login', dados),

  // Redefine a senha
  redefinirSenha: (dados) => api.post('/auth/reset-password', dados),
};

