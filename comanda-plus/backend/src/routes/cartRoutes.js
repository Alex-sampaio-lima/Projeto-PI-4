// src/routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');
const { cartAddValidator, cartUpdateValidator } = require('../validators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

// GET /cart — lista todos os itens
router.get('/', cartController.getAll);

// POST /cart — adiciona item ao carrinho
router.post('/', cartAddValidator, handleValidationErrors, cartController.addItem);

// PUT /cart/:id — atualiza quantidade
router.put('/:id', cartUpdateValidator, handleValidationErrors, cartController.updateItem);

// DELETE /cart/clear — limpa o carrinho inteiro
router.delete('/clear', cartController.clearCart);

// DELETE /cart/:id — remove item específico
router.delete('/:id', cartController.removeItem);

module.exports = router;
