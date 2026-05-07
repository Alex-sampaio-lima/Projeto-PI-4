// src/controllers/orderController.js
// Controller de pedidos (async/await)

const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

const orderController = {
  async getAll(req, res, next) {
    try {
      const pedidos = await orderModel.getAll();
      res.json({ sucesso: true, dados: pedidos });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const pedido = await orderModel.getById(req.params.id);
      if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });
      res.json({ sucesso: true, dados: pedido });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { address_id, observacao } = req.body;
      const itensCarrinho = await cartModel.getAll();

      if (!itensCarrinho || itensCarrinho.length === 0)
        return res.status(400).json({ sucesso: false, mensagem: 'O carrinho está vazio' });

      const total = await cartModel.getTotal();

      const itens = itensCarrinho.map((item) => ({
        product_id: item.product_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
      }));

      // Pega o company_id do primeiro item (pela regra de uma única loja)
      const company_id = itensCarrinho[0].company_id;

      const pedido = await orderModel.create({ total, address_id, company_id, observacao, itens });

      // Limpa o carrinho após criar o pedido
      await cartModel.clearCart();

      res.status(201).json({ sucesso: true, dados: pedido });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const statusValidos = ['pendente', 'confirmado', 'em_preparo', 'a_caminho', 'entregue', 'cancelado'];

      const pedido = await orderModel.getById(req.params.id);
      if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });

      const atualizado = await orderModel.updateStatus(req.params.id, status);
      res.json({ sucesso: true, dados: atualizado });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const pedido = await orderModel.getById(req.params.id);
      if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });
      await orderModel.delete(req.params.id);
      res.json({ sucesso: true, mensagem: 'Pedido removido com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
