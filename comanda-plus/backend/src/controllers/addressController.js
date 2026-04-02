// src/controllers/addressController.js
// Controller de endereços (async/await)

const addressModel = require('../models/addressModel');

const addressController = {
  async getAll(req, res, next) {
    try {
      const enderecos = await addressModel.getAll();
      res.json({ sucesso: true, dados: enderecos });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const endereco = await addressModel.getById(req.params.id);
      if (!endereco) return res.status(404).json({ sucesso: false, mensagem: 'Endereço não encontrado' });
      res.json({ sucesso: true, dados: endereco });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { rua, numero, bairro, cidade, estado, cep } = req.body;
      const endereco = await addressModel.create(req.body);
      res.status(201).json({ sucesso: true, dados: endereco });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const endereco = await addressModel.getById(req.params.id);
      if (!endereco) return res.status(404).json({ sucesso: false, mensagem: 'Endereço não encontrado' });
      const atualizado = await addressModel.update(req.params.id, req.body);
      res.json({ sucesso: true, dados: atualizado });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const endereco = await addressModel.getById(req.params.id);
      if (!endereco) return res.status(404).json({ sucesso: false, mensagem: 'Endereço não encontrado' });
      await addressModel.delete(req.params.id);
      res.json({ sucesso: true, mensagem: 'Endereço removido com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = addressController;
