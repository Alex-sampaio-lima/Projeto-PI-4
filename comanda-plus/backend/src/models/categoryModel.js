// src/models/categoryModel.js
// Model de categorias — CRUD com sqlite3 (API assíncrona via Promises)

const { run, get, all } = require('../config/database');

const categoryModel = {
  getAll: () => all('SELECT * FROM categories ORDER BY nome ASC'),

  getById: (id) => get('SELECT * FROM categories WHERE id = ?', [id]),

  async create({ nome, icone }) {
    const r = await run('INSERT INTO categories (nome, icone) VALUES (?, ?)', [nome, icone || null]);
    return get('SELECT * FROM categories WHERE id = ?', [r.lastID]);
  },

  async update(id, { nome, icone }) {
    await run('UPDATE categories SET nome = ?, icone = ? WHERE id = ?', [nome, icone || null, id]);
    return get('SELECT * FROM categories WHERE id = ?', [id]);
  },

  delete: (id) => run('DELETE FROM categories WHERE id = ?', [id]),
};

module.exports = categoryModel;
