// src/routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

// GET /cart — lista todos os itens
router.get('/', cartController.getAll);

// POST /cart — adiciona item ao carrinho
router.post('/', cartController.addItem);

// PUT /cart/:id — atualiza quantidade
router.put('/:id', cartController.updateItem);

// DELETE /cart/clear — limpa o carrinho inteiro
router.delete('/clear', cartController.clearCart);

// DELETE /cart/:id — remove item específico
router.delete('/:id', cartController.removeItem);

module.exports = router;
