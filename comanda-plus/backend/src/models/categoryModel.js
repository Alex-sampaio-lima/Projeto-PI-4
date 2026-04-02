// src/models/categoryModel.js
// Model de categorias — CRUD com sqlite3 (API assíncrona via Promises)

const db = require('../config/database');

// Helper: executa query sem retorno (INSERT, UPDATE, DELETE)
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Helper: retorna um único resultado
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper: retorna todos os resultados
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

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
