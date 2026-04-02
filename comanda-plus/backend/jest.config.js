// jest.config.js
// Configuração do Jest para o backend Comanda+

/** @type {import('jest').Config} */
module.exports = {
  // Ambiente de testes Node.js
  testEnvironment: 'node',

  // Pasta onde os testes estão
  testMatch: ['**/__tests__/**/*.test.js'],

  // Timeout por teste (10 segundos, SQLite pode demorar)
  testTimeout: 10000,

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/database/init.js', // dados mock não precisam de cobertura
  ],

  // Exibição detalhada no terminal
  verbose: true,
};
