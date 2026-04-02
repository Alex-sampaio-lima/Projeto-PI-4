// src/routes/addressRoutes.js
const express = require('express');
const addressController = require('../controllers/addressController');
const { addressValidator } = require('../validators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', addressController.getAll);
router.get('/:id', addressController.getById);
router.post('/', addressValidator, handleValidationErrors, addressController.create);
router.put('/:id', addressController.update);
router.delete('/:id', addressController.delete);

module.exports = router;
