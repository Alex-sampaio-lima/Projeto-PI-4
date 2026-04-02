// src/app.js
// Configuração do Express — middlewares, rotas e tratamento de erros

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ===== Middlewares ===== //

// Habilita CORS para todas as origens (importante para o Expo/mobile)
app.use(cors());

// Parseia body JSON nas requisições
app.use(express.json());

// ===== Rotas ===== //

// Prefixo /api para todas as rotas
app.use('/api', routes);

// ===== Tratamento de erros ===== //

// Rota 404 — quando nenhuma rota for encontrada
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada' });
});

// Middleware global de erros (deve ser o último)
app.use(errorHandler);

module.exports = app;
