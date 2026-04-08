// src/controllers/authController.js
// Controller de autenticação — cadastro e login

const userModel = require('../models/userModel');

const authController = {
  // POST /auth/register
  async register(req, res, next) {
    try {
      let { nome, email, senha } = req.body;
      if (email) email = email.trim().toLowerCase();

      if (!nome || !email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome, e-mail e senha são obrigatórios.' });
      }

      if (senha.length < 6) {
        return res.status(400).json({ sucesso: false, mensagem: 'A senha deve ter no mínimo 6 caracteres.' });
      }

      // Verifica se e-mail já existe
      const existente = await userModel.getByEmail(email);
      if (existente) {
        return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado. Faça login.' });
      }

      const usuario = await userModel.create({ nome, email, senha });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Conta criada com sucesso!',
        dados: usuario,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /auth/login
  async login(req, res, next) {
    try {
      let { email, senha } = req.body;
      if (email) email = email.trim().toLowerCase();

      if (!email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' });
      }

      const usuario = await userModel.getByEmail(email);
      if (!usuario) {
        return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha inválidos.' });
      }

      const senhaCorreta = await userModel.verificarSenha(senha, usuario.senha_hash);
      if (!senhaCorreta) {
        return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha inválidos.' });
      }

      return res.json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        dados: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /auth/reset-password
  async resetPassword(req, res, next) {
    try {
      let { email, novaSenha } = req.body;

      if (!email || !novaSenha) {
        return res.status(400).json({ sucesso: false, mensagem: 'E-mail e nova senha são obrigatórios.' });
      }

      email = email.trim().toLowerCase();

      // Verifica se o usuário existe
      const usuario = await userModel.getByEmail(email);
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado com este e-mail.' });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({ sucesso: false, mensagem: 'A nova senha deve ter no mínimo 6 caracteres.' });
      }

      await userModel.updatePassword(email, novaSenha);

      return res.json({
        sucesso: true,
        mensagem: 'Senha redefinida com sucesso!',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
