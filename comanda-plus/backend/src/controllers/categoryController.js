// src/controllers/categoryController.js
// Controller de categorias — lógica das rotas (async/await)

const categoryModel = require('../models/categoryModel');

const categoryController = {
  async getAll(req, res, next) {
    try {
      const categorias = await categoryModel.getAll();
      res.json({ sucesso: true, dados: categorias });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const categoria = await categoryModel.getById(req.params.id);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      res.json({ sucesso: true, dados: categoria });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { nome, icone } = req.body;
      if (!nome) return res.status(400).json({ sucesso: false, mensagem: 'Nome é obrigatório' });
      const categoria = await categoryModel.create({ nome, icone });
      res.status(201).json({ sucesso: true, dados: categoria });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const categoria = await categoryModel.getById(req.params.id);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      const atualizada = await categoryModel.update(req.params.id, req.body);
      res.json({ sucesso: true, dados: atualizada });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const categoria = await categoryModel.getById(req.params.id);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      await categoryModel.delete(req.params.id);
      res.json({ sucesso: true, mensagem: 'Categoria removida com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
