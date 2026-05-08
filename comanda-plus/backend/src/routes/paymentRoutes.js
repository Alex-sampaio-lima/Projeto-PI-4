// src/routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-preference', paymentController.createPreference);
router.post('/webhook', express.json(), paymentController.webhook);

module.exports = router;
