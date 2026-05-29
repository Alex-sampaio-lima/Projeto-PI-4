// src/routes/paymentMethodRoutes.js
// Rotas de formas de pagamento

const express = require('express');
const paymentMethodController = require('../controllers/paymentMethodController');
const { paymentMethodValidator } = require('../validators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', paymentMethodController.getAll);
router.get('/:id', paymentMethodController.getById);
router.post('/', paymentMethodValidator, handleValidationErrors, paymentMethodController.create);
router.put('/:id', paymentMethodController.update);
router.delete('/:id', paymentMethodController.delete);

module.exports = router;
