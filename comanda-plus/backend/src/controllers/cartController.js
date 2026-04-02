// src/controllers/cartController.js
// Controller do carrinho (async/await)

const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

const cartController = {
  async getAll(req, res, next) {
    try {
      const itens = await cartModel.getAll();
      const total = await cartModel.getTotal();
      res.json({ sucesso: true, dados: { itens, total } });
    } catch (error) {
      next(error);
    }
  },

  async addItem(req, res, next) {
    try {
      const { product_id, quantidade } = req.body;
      if (!product_id) return res.status(400).json({ sucesso: false, mensagem: 'product_id é obrigatório' });
      const produto = await productModel.getById(product_id);
      if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      const item = await cartModel.addItem(product_id, quantidade || 1);
      res.status(201).json({ sucesso: true, dados: item });
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req, res, next) {
    try {
      const { quantidade } = req.body;
      if (!quantidade || quantidade < 1) return res.status(400).json({ sucesso: false, mensagem: 'Quantidade deve ser maior que 0' });
      const item = await cartModel.getById(req.params.id);
      if (!item) return res.status(404).json({ sucesso: false, mensagem: 'Item não encontrado no carrinho' });
      const atualizado = await cartModel.updateQuantidade(req.params.id, quantidade);
      res.json({ sucesso: true, dados: atualizado });
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req, res, next) {
    try {
      const item = await cartModel.getById(req.params.id);
      if (!item) return res.status(404).json({ sucesso: false, mensagem: 'Item não encontrado no carrinho' });
      await cartModel.removeItem(req.params.id);
      res.json({ sucesso: true, mensagem: 'Item removido do carrinho' });
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req, res, next) {
    try {
      await cartModel.clearCart();
      res.json({ sucesso: true, mensagem: 'Carrinho limpo com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
