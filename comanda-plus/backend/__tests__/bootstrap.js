// __tests__/bootstrap.js
const path = require('path');
const fs = require('fs');

/**
 * Esse módulo deve ser carregado no TOPO de cada arquivo de teste
 * antes de importar qualquer módulo do src/, para garantir que as
 * variáveis de ambiente estejam configuradas para o banco correto.
 */
module.exports = (testName) => {
  const dbPath = ':memory:';
  
  process.env.DB_PATH = dbPath;
  process.env.NODE_ENV = 'test';

  // Limpa o cache do require para forçar o db.js a ler a nova DB_PATH
  if (typeof jest !== 'undefined') {
    jest.resetModules();
  }

  // Importa o setup factory que usa as env vars atuais
  return require('./testSetup');
};
