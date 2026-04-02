// __tests__/testSetup.js
const path = require('path');
const fs = require('fs');

function getDBPath(testName) {
  const name = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return path.resolve(__dirname, `../test-database-${name}.sqlite`);
}

async function setupTestDB() {
  // O bootstrap já definiu DB_PATH=:memory: e limpou o cache
  const { inicializarBanco } = require('../src/database/init');
  await inicializarBanco();
}

async function teardownTestDB() {
  const { closeConnection } = require('../src/database/db');
  try {
    await closeConnection();
  } catch (e) {
    // Silencia erros no fechamento se o banco já estiver fechado
  }
}

module.exports = {
  setupTestDB,
  teardownTestDB
};
