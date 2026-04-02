// src/routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const { orderStatusValidator } = require('../validators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id/status', orderStatusValidator, handleValidationErrors, orderController.updateStatus);
router.delete('/:id', orderController.delete);

module.exports = router;
