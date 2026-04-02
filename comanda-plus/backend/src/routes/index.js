// src/routes/index.js
// Agrupador central de todas as rotas da API

const express = require('express');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const addressRoutes = require('./addressRoutes');

const router = express.Router();

// Rota de health check
router.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Comanda+ API está funcionando! 🚀',
    versao: '1.0.0',
    endpoints: ['/products', '/categories', '/cart', '/orders', '/addresses'],
  });
});

// Registra todas as rotas
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);

module.exports = router;
