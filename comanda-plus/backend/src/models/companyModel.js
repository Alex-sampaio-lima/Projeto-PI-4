// src/models/companyModel.js
// Model de empresas (restaurantes) — CRUD com sqlite3

const { run, get, all } = require('../config/database');

const SQL_SELECT = 'SELECT * FROM companies';

const companyModel = {
  // Lista todas as empresas
  getAll: (categoria = null) => {
    if (categoria) {
      return all(`${SQL_SELECT} WHERE categoria = ? ORDER BY nome ASC`, [categoria]);
    }
    return all(`${SQL_SELECT} ORDER BY nome ASC`);
  },

  // Busca empresa por ID
  getById: (id) => get(`${SQL_SELECT} WHERE id = ?`, [id]),

  // Cria uma nova empresa
  async create({ nome, logo, banner, tempo_entrega, frete, avaliacao, categoria }) {
    const r = await run(
      'INSERT INTO companies (nome, logo, banner, tempo_entrega, frete, avaliacao, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, logo, banner, tempo_entrega, frete || 0, avaliacao || 0, categoria]
    );
    return get(`${SQL_SELECT} WHERE id = ?`, [r.lastID]);
  },
};

module.exports = companyModel;
