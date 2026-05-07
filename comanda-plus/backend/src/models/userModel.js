// src/models/userModel.js
// Model de usuários — cadastro e login com bcryptjs

const { run, get } = require('../config/database');
const bcrypt = require('bcryptjs');

const userModel = {
  // Cria a tabela de usuários se não existir
  async criarTabela() {
    return run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  // Busca usuário por e-mail
  getByEmail: (email) => get('SELECT * FROM users WHERE email = ?', [email]),

  // Busca usuário por ID (sem retornar a senha)
  getById: (id) => get('SELECT id, nome, email, created_at FROM users WHERE id = ?', [id]),

  // Cria novo usuário (hash da senha incluído)
  async create({ nome, email, senha }) {
    const senhaHash = await bcrypt.hash(senha, 10);
    const r = await run(
      'INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );
    return { id: r.lastID, nome, email };
  },

  // Verifica se a senha está correta
  async verificarSenha(senhaDigitada, senhaHash) {
    return bcrypt.compare(senhaDigitada, senhaHash);
  },

  // Atualiza a senha do usuário
  async updatePassword(email, novaSenha) {
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    return run('UPDATE users SET senha_hash = ? WHERE email = ?', [senhaHash, email.toLowerCase().trim()]);
  },
};

module.exports = userModel;
