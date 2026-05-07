// src/models/addressModel.js
// Model de endereços — CRUD com sqlite3

const { run, get, all } = require('../config/database');

const addressModel = {
  getAll: () => all('SELECT * FROM addresses ORDER BY principal DESC, id ASC'),

  getById: (id) => get('SELECT * FROM addresses WHERE id = ?', [id]),

  async create({ rua, numero, bairro, cidade, estado, cep, complemento, principal }) {
    if (principal) await run('UPDATE addresses SET principal = 0');
    const r = await run(
      'INSERT INTO addresses (rua, numero, bairro, cidade, estado, cep, complemento, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [rua, numero, bairro, cidade, estado, cep, complemento || null, principal ? 1 : 0]
    );
    return get('SELECT * FROM addresses WHERE id = ?', [r.lastID]);
  },

  async update(id, { rua, numero, bairro, cidade, estado, cep, complemento, principal }) {
    if (principal) await run('UPDATE addresses SET principal = 0');
    await run(
      'UPDATE addresses SET rua=?, numero=?, bairro=?, cidade=?, estado=?, cep=?, complemento=?, principal=? WHERE id=?',
      [rua, numero, bairro, cidade, estado, cep, complemento || null, principal ? 1 : 0, id]
    );
    return get('SELECT * FROM addresses WHERE id = ?', [id]);
  },

  delete: (id) => run('DELETE FROM addresses WHERE id = ?', [id]),
};

module.exports = addressModel;
