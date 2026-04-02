// src/routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.delete);

module.exports = router;
