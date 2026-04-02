// src/routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController');
const { productValidator } = require('../validators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

// GET /products  |  GET /products?category_id=1
router.get('/', productController.getAll);

// GET /products/:id
router.get('/:id', productController.getById);

// POST /products
router.post('/', productValidator, handleValidationErrors, productController.create);

// PUT /products/:id
router.put('/:id', productValidator, handleValidationErrors, productController.update);

// DELETE /products/:id
router.delete('/:id', productController.delete);

module.exports = router;
