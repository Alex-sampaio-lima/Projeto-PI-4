// src/middlewares/errorHandler.js
// Middleware global de tratamento de erros

/**
 * Middleware de erro — deve ser registrado por último no app.js
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Erro:', err.message);

  // Define o status HTTP (padrão 500)
  const status = err.status || 500;

  res.status(status).json({
    sucesso: false,
    mensagem: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
