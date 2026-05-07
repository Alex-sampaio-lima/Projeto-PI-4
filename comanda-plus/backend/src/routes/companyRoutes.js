// src/routes/companyRoutes.js
// Rotas para gerenciar empresas

const express = require('express');
const companyController = require('../controllers/companyController');

const router = express.Router();

// GET /api/companies — lista todas as empresas (com filtro opcional de categoria)
router.get('/', companyController.index);

// GET /api/companies/:id — detalhes de uma empresa e seus produtos
router.get('/:id', companyController.show);

module.exports = router;
