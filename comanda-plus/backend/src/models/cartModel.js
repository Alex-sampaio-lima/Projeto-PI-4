// src/models/cartModel.js
// Model do carrinho — CRUD com sqlite3

const { run, get, all } = require('../config/database');

const SQL_ITEM = `
  SELECT c.id, c.quantidade, c.created_at,
         p.id AS product_id, p.nome, p.preco, p.imagem
  FROM cart c
  JOIN products p ON c.product_id = p.id
`;

const cartModel = {
  getAll: () => all(SQL_ITEM),

  getById: (id) => get(`${SQL_ITEM} WHERE c.id = ?`, [id]),

  getByProductId: (productId) => get('SELECT * FROM cart WHERE product_id = ?', [productId]),

  async addItem(productId, quantidade = 1) {
    const existente = await this.getByProductId(productId);
    if (existente) {
      await run('UPDATE cart SET quantidade = quantidade + ? WHERE product_id = ?', [quantidade, productId]);
      return get(`${SQL_ITEM} WHERE c.product_id = ?`, [productId]);
    }
    const r = await run('INSERT INTO cart (product_id, quantidade) VALUES (?, ?)', [productId, quantidade]);
    return get(`${SQL_ITEM} WHERE c.id = ?`, [r.lastID]);
  },

  async updateQuantidade(id, quantidade) {
    await run('UPDATE cart SET quantidade = ? WHERE id = ?', [quantidade, id]);
    return get(`${SQL_ITEM} WHERE c.id = ?`, [id]);
  },

  removeItem: (id) => run('DELETE FROM cart WHERE id = ?', [id]),

  clearCart: () => run('DELETE FROM cart'),

  async getTotal() {
    const r = await get('SELECT SUM(c.quantidade * p.preco) AS total FROM cart c JOIN products p ON c.product_id = p.id');
    return r.total || 0;
  },
};

module.exports = cartModel;
