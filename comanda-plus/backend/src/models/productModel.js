// src/models/productModel.js
// Model de produtos — CRUD com sqlite3

const db = require('../config/database');

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

const SQL_SELECT = `
  SELECT p.*, c.nome AS categoria_nome
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
`;

const productModel = {
  getAll: () => all(`${SQL_SELECT} WHERE p.disponivel = 1 ORDER BY p.nome ASC`),

  getByCategory: (categoryId) =>
    all(`${SQL_SELECT} WHERE p.category_id = ? AND p.disponivel = 1 ORDER BY p.nome ASC`, [categoryId]),

  getById: (id) => get(`${SQL_SELECT} WHERE p.id = ?`, [id]),

  async create({ nome, descricao, preco, imagem, avaliacao, category_id }) {
    const r = await run(
      'INSERT INTO products (nome, descricao, preco, imagem, avaliacao, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao || null, preco, imagem || null, avaliacao || 0, category_id || null]
    );
    return get(`${SQL_SELECT} WHERE p.id = ?`, [r.lastID]);
  },

  async update(id, { nome, descricao, preco, imagem, avaliacao, category_id, disponivel }) {
    await run(
      'UPDATE products SET nome=?, descricao=?, preco=?, imagem=?, avaliacao=?, category_id=?, disponivel=? WHERE id=?',
      [nome, descricao || null, preco, imagem || null, avaliacao || 0, category_id || null, disponivel ?? 1, id]
    );
    return get(`${SQL_SELECT} WHERE p.id = ?`, [id]);
  },

  delete: (id) => run('DELETE FROM products WHERE id = ?', [id]),
};

module.exports = productModel;
