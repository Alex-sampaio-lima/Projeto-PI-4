// src/models/orderModel.js
// Model de pedidos — CRUD com sqlite3

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

const orderModel = {
  getAll: () => all(`
    SELECT o.*, a.rua, a.numero, a.bairro, a.cidade, a.estado
    FROM orders o
    LEFT JOIN addresses a ON o.address_id = a.id
    ORDER BY o.created_at DESC
  `),

  async getById(id) {
    const pedido = await get(`
      SELECT o.*, a.rua, a.numero, a.bairro, a.cidade, a.estado
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = ?
    `, [id]);

    if (!pedido) return null;

    pedido.itens = await all(`
      SELECT oi.*, p.nome AS produto_nome, p.imagem
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    return pedido;
  },

  async create({ total, address_id, observacao, itens }) {
    // Cria o pedido
    const r = await run(
      "INSERT INTO orders (total, address_id, observacao, status) VALUES (?, ?, ?, 'confirmado')",
      [total, address_id || null, observacao || null]
    );
    const orderId = r.lastID;

    // Insere os itens
    for (const item of itens) {
      await run(
        'INSERT INTO order_items (order_id, product_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantidade, item.preco_unitario]
      );
    }

    return this.getById(orderId);
  },

  async updateStatus(id, status) {
    await run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  },

  async delete(id) {
    await run('DELETE FROM order_items WHERE order_id = ?', [id]);
    return run('DELETE FROM orders WHERE id = ?', [id]);
  },
};

module.exports = orderModel;
