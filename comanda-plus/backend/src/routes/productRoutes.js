// src/routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// GET /products  |  GET /products?category_id=1
router.get('/', productController.getAll);

// GET /products/:id
router.get('/:id', productController.getById);

// POST /products
router.post('/', productController.create);

// PUT /products/:id
router.put('/:id', productController.update);

// DELETE /products/:id
router.delete('/:id', productController.delete);

module.exports = router;
