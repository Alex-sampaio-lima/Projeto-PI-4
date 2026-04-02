// src/database/db.js
// Conexão com o banco de dados SQLite usando o módulo 'sqlite3'

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Caminho do arquivo do banco de dados
const dbPath = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.resolve(__dirname, '../../database.sqlite');

// Cria (ou abre) o banco de dados no caminho definido
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log(`✅ Banco de dados conectado: ${dbPath}`);
    // Ativa o modo WAL para melhor performace com múltiplas leituras
    db.run('PRAGMA journal_mode = WAL;');
  }
});

module.exports = db;
