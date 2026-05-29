// src/controllers/paymentMethodController.js
// Controller de formas de pagamento (async/await)

const paymentMethodModel = require('../models/paymentMethodModel');

const paymentMethodController = {
  async getAll(req, res, next) {
    try {
      const metodos = await paymentMethodModel.getAll();
      res.json({ sucesso: true, dados: metodos });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const metodo = await paymentMethodModel.getById(req.params.id);
      if (!metodo) {
        return res.status(404).json({ sucesso: false, mensagem: 'Forma de pagamento não encontrada' });
      }
      res.json({ sucesso: true, dados: metodo });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const metodo = await paymentMethodModel.create(req.body);
      res.status(201).json({ sucesso: true, dados: metodo });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const metodo = await paymentMethodModel.getById(req.params.id);
      if (!metodo) {
        return res.status(404).json({ sucesso: false, mensagem: 'Forma de pagamento não encontrada' });
      }
      const atualizado = await paymentMethodModel.update(req.params.id, req.body);
      res.json({ sucesso: true, dados: atualizado });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const metodo = await paymentMethodModel.getById(req.params.id);
      if (!metodo) {
        return res.status(404).json({ sucesso: false, mensagem: 'Forma de pagamento não encontrada' });
      }
      await paymentMethodModel.delete(req.params.id);
      res.json({ sucesso: true, mensagem: 'Forma de pagamento removida com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = paymentMethodController;
