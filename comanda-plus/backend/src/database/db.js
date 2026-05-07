// src/database/db.js
// Conexão com o banco de dados SQLite usando o módulo 'sqlite3'

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Caminho do arquivo do banco de dados
const dbPath = process.env.DB_PATH === ':memory:'
  ? ':memory:'
  : (process.env.DB_PATH
    ? path.resolve(process.cwd(), process.env.DB_PATH)
    : path.resolve(__dirname, '../../database.sqlite'));

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

// Helpers para facilitar o uso de queries com Promises (padrão solicitado para limpeza)
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Função para encerrar a conexão com o banco (útil para testes)
const closeConnection = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('❌ Erro ao fechar banco:', err.message);
        reject(err);
      } else {
        console.log('✅ Conexão com banco encerrada.');
        resolve();
      }
    });
  });
};

module.exports = db;
module.exports.closeConnection = closeConnection;
module.exports.run = run;
module.exports.get = get;
module.exports.all = all;

