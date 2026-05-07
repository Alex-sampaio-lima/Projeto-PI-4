// src/config/database.js
// Centraliza o acesso ao banco e facilita o uso de queries assíncronas

const db = require('../database/db');

module.exports = {
  db,
  run: db.run,
  get: db.get,
  all: db.all,
  closeConnection: db.closeConnection,
};
