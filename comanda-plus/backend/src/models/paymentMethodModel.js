// src/models/paymentMethodModel.js
// Model de formas de pagamento — CRUD com sqlite3

const { run, get, all } = require('../config/database');

const paymentMethodModel = {
  getAll: () => all('SELECT * FROM payment_methods ORDER BY principal DESC, id ASC'),

  getById: (id) => get('SELECT * FROM payment_methods WHERE id = ?', [id]),

  async create({ tipo, bandeira, final, icone, principal }) {
    if (principal) await run('UPDATE payment_methods SET principal = 0');
    const r = await run(
      'INSERT INTO payment_methods (tipo, bandeira, final, icone, principal) VALUES (?, ?, ?, ?, ?)',
      [tipo, bandeira || null, final || null, icone || null, principal ? 1 : 0]
    );
    return get('SELECT * FROM payment_methods WHERE id = ?', [r.lastID]);
  },

  async update(id, { tipo, bandeira, final, icone, principal }) {
    if (principal) await run('UPDATE payment_methods SET principal = 0');
    await run(
      'UPDATE payment_methods SET tipo=?, bandeira=?, final=?, icone=?, principal=? WHERE id=?',
      [tipo, bandeira || null, final || null, icone || null, principal ? 1 : 0, id]
    );
    return get('SELECT * FROM payment_methods WHERE id = ?', [id]);
  },

  delete: (id) => run('DELETE FROM payment_methods WHERE id = ?', [id]),
};

module.exports = paymentMethodModel;
