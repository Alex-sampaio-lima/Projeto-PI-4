// src/middlewares/validationMiddleware.js
// Middleware genérico para processar os erros gerados pelo express-validator
const { validationResult } = require('express-validator');

// Esta função verifica se existem erros acumulados nas validações anteriores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se houver erros, pegamos apenas a primeira mensagem ou montamos uma lista limpa
    // No nosso caso do frontend, ele espera { sucesso: false, mensagem: "..." }
    const firstErrorMsg = errors.array()[0].msg;
    
    return res.status(400).json({ 
      sucesso: false, 
      mensagem: firstErrorMsg,
      detalhes: errors.array() // Pode ser útil para debug em ambiente de desenvolvimento
    });
  }
  // Se não houver erros, seguimos para o controller principal
  next();
};

module.exports = {
  handleValidationErrors
};
