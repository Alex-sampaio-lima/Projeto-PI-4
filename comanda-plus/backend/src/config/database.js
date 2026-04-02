// src/config/database.js
// Re-exporta a instância do banco para uso nos models

const db = require('../database/db');

module.exports = db;
// Note: as funções exportadas por db.js já estão anexadas ao objeto db
