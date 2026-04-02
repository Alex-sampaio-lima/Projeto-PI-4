// src/routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');
const { categoryValidator } = require('../validators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryValidator, handleValidationErrors, categoryController.create);
router.put('/:id', categoryValidator, handleValidationErrors, categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
