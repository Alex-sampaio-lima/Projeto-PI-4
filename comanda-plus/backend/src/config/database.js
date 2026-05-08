// src/config/database.js
// Centraliza o acesso ao banco e facilita o uso de queries assíncronas

const dbModule = require('../database/db');

module.exports = {
  db: dbModule.db,
  run: dbModule.run,
  get: dbModule.get,
  all: dbModule.all,
  closeConnection: dbModule.closeConnection,
};
