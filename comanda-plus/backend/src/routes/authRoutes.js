// src/routes/authRoutes.js
// Rotas de autenticação — cadastro e login

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register — cria uma nova conta
router.post('/register', authController.register);

// POST /api/auth/login — faz login
router.post('/login', authController.login);

// POST /api/auth/reset-password — redefine a senha
router.post('/reset-password', authController.resetPassword);

module.exports = router;
