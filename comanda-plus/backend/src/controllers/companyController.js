// src/controllers/companyController.js
// Controller para gerenciar empresas

const companyModel = require('../models/companyModel');
const productModel = require('../models/productModel');

const companyController = {
  // GET /api/companies
  async index(req, res, next) {
    try {
      const { categoria } = req.query;
      const companies = await companyModel.getAll(categoria);
      return res.json({ sucesso: true, dados: companies });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/companies/:id
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const company = await companyModel.getById(id);
      
      if (!company) {
        return res.status(404).json({ sucesso: false, mensagem: 'Empresa não encontrada.' });
      }

      // Aproveitamos para retornar os produtos desta empresa também
      const produtos = await productModel.getByCompany(id);

      return res.json({ 
        sucesso: true, 
        dados: { ...company, produtos } 
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = companyController;
