// src/models/orderModel.js
// Model de pedidos — CRUD com sqlite3

const { run, get, all } = require('../config/database');

const orderModel = {
  getAll: () => all(`
    SELECT o.*, a.rua, a.numero, a.bairro, a.cidade, a.estado, c.nome AS empresa_nome
    FROM orders o
    LEFT JOIN addresses a ON o.address_id = a.id
    LEFT JOIN companies c ON o.company_id = c.id
    ORDER BY o.id DESC
  `),

  async getById(id) {
    const pedido = await get(`
      SELECT o.*, a.rua, a.numero, a.bairro, a.cidade, a.estado, c.nome AS empresa_nome, c.logo AS empresa_logo
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      LEFT JOIN companies c ON o.company_id = c.id
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

  async create({ total, frete, address_id, company_id, observacao, forma_pagamento, status, itens }) {
    // Cria o pedido
    const r = await run(
      "INSERT INTO orders (total, frete, address_id, company_id, observacao, forma_pagamento, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [total, frete || 0, address_id || null, company_id || null, observacao || null, forma_pagamento || null, status || 'pendente']
    );
    const orderId = r.lastID;

    // Insere os itens
    for (const item of itens) {
      await run(
        'INSERT INTO order_items (order_id, product_id, quantidade, preco_unitario, observacao) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantidade, item.preco_unitario, item.observacao || null]
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
