// src/routes/index.js
// Agrupador central de todas as rotas da API

const express = require('express');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const addressRoutes = require('./addressRoutes');
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const paymentRoutes = require('./paymentRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Rota de health check
router.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Comanda+ API está funcionando! 🚀',
    versao: '1.0.0',
    endpoints: ['/products', '/categories', '/cart', '/orders', '/addresses', '/companies', '/payments', '/dashboard/export'],
  });
});

// Registra todas as rotas
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);
router.use('/companies', companyRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
