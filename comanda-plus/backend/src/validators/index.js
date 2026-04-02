// src/validators/index.js
// Esquemas de validação centralizados utilizando express-validator

const { body } = require('express-validator');

// Validador para Produtos (POST / PUT)
const productValidator = [
  body('nome')
    .notEmpty().withMessage('O nome do produto é obrigatório.')
    .isString().withMessage('O nome do produto deve ser texto.'),
  body('preco')
    .notEmpty().withMessage('O preço é obrigatório.')
    .isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo.')
];

// Validador para Categorias (POST / PUT)
const categoryValidator = [
  body('nome')
    .notEmpty().withMessage('O nome da categoria é obrigatório.')
    .isString().withMessage('O nome da categoria deve ser texto.')
];

// Validador para Carrinho - Adicionar Item (POST)
const cartAddValidator = [
  body('product_id')
    .notEmpty().withMessage('O ID do produto (product_id) é obrigatório.')
    .isInt({ min: 1 }).withMessage('O ID do produto deve ser um inteiro válido.'),
  body('quantidade')
    .optional()
    .isInt({ min: 1 }).withMessage('Se informada, a quantidade deve ser pelo menos 1.')
];

// Validador para Carrinho - Atualizar Quantidade (PUT)
const cartUpdateValidator = [
  body('quantidade')
    .notEmpty().withMessage('A quantidade é obrigatória.')
    .isInt({ min: 1 }).withMessage('A quantidade deve ser maior ou igual a 1.')
];

// Validador para Pedidos - Atualizar Status (PUT)
const orderStatusValidator = [
  body('status')
    .notEmpty().withMessage('O status é obrigatório.')
    .isIn(['pendente', 'confirmado', 'em_preparo', 'a_caminho', 'entregue', 'cancelado'])
    .withMessage('Status inválido. Valores permitidos: pendente, confirmado, em_preparo, a_caminho, entregue, cancelado.')
];

// Validador para Endereço - Criar (POST)
const addressValidator = [
  body('rua').notEmpty().withMessage('A rua é obrigatória.'),
  body('numero').notEmpty().withMessage('O número é obrigatório.'),
  body('bairro').notEmpty().withMessage('O bairro é obrigatório.'),
  body('cidade').notEmpty().withMessage('A cidade é obrigatória.'),
  body('estado').notEmpty().withMessage('O estado é obrigatório.'),
  body('cep').notEmpty().withMessage('O CEP é obrigatório.')
];

module.exports = {
  productValidator,
  categoryValidator,
  cartAddValidator,
  cartUpdateValidator,
  orderStatusValidator,
  addressValidator
};
