// src/controllers/productController.js
// Controller de produtos (async/await)

const productModel = require('../models/productModel');

const productController = {
  async getAll(req, res, next) {
    try {
      let produtos;
      if (req.query.category_id) {
        produtos = await productModel.getByCategory(req.query.category_id);
      } else {
        produtos = await productModel.getAll();
      }
      res.json({ sucesso: true, dados: produtos });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const produto = await productModel.getById(req.params.id);
      if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      res.json({ sucesso: true, dados: produto });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { nome, preco } = req.body;
      const produto = await productModel.create(req.body);
      res.status(201).json({ sucesso: true, dados: produto });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const produto = await productModel.getById(req.params.id);
      if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      const atualizado = await productModel.update(req.params.id, req.body);
      res.json({ sucesso: true, dados: atualizado });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const produto = await productModel.getById(req.params.id);
      if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      await productModel.delete(req.params.id);
      res.json({ sucesso: true, mensagem: 'Produto removido com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
