// src/routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Retorna os dados estatísticos consolidados em JSON
router.get('/export', dashboardController.getExportData);

module.exports = router;
