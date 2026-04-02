// server.js
// Ponto de entrada do servidor — carrega variáveis de ambiente, inicializa banco e sobe o Express

require('dotenv').config();

const app = require('./src/app');
const { inicializarBanco } = require('./src/database/init');

const PORT = process.env.PORT || 3000;

// Inicializa o banco de dados (cria tabelas + dados mock se necessário)
inicializarBanco();

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📡 API disponível em:   http://localhost:${PORT}/api`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   GET  http://localhost:${PORT}/api/products`);
  console.log(`   GET  http://localhost:${PORT}/api/categories`);
  console.log(`   GET  http://localhost:${PORT}/api/cart`);
  console.log(`   GET  http://localhost:${PORT}/api/orders`);
  console.log(`   GET  http://localhost:${PORT}/api/addresses\n`);
});
