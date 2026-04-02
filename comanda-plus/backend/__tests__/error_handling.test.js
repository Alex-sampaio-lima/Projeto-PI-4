// __tests__/error_handling.test.js
const { setupTestDB, teardownTestDB } = require('./bootstrap')('error_handling');
const request = require('supertest');
const app = require('../src/app');

// Models para mockar erros
const productModel = require('../src/models/productModel');
const addressModel = require('../src/models/addressModel');
const categoryModel = require('../src/models/categoryModel');
const cartModel = require('../src/models/cartModel');
const orderModel = require('../src/models/orderModel');

beforeAll(async () => {
  await setupTestDB('error_handling');
});

afterAll(async () => {
  await teardownTestDB('error_handling');
});

describe('Tratamento de Erros nos Controllers (Blocos Catch)', () => {
  it('Produtos - deve chamar errorHandler em caso de erro no banco (GET)', async () => {
    jest.spyOn(productModel, 'getAll').mockRejectedValueOnce(new Error('Falha no banco'));
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(500); // errorHandler padrão
    expect(res.body.sucesso).toBe(false);
  });

  it('Categorias - deve chamar errorHandler em caso de erro no banco (POST)', async () => {
    jest.spyOn(categoryModel, 'create').mockRejectedValueOnce(new Error('Falha no banco'));
    const res = await request(app).post('/api/categories').send({ nome: 'Teste' });
    expect(res.statusCode).toBe(500);
  });

  it('Endereços - deve chamar errorHandler em caso de erro no banco (GET BY ID)', async () => {
    jest.spyOn(addressModel, 'getById').mockRejectedValueOnce(new Error('Falha no banco'));
    const res = await request(app).get('/api/addresses/1');
    expect(res.statusCode).toBe(500);
  });

  it('Carrinho - deve chamar errorHandler em caso de erro no banco (DELETE)', async () => {
    jest.spyOn(cartModel, 'getById').mockRejectedValueOnce(new Error('Falha no banco'));
    const res = await request(app).delete('/api/cart/1');
    expect(res.statusCode).toBe(500);
  });

  it('Pedidos - deve chamar errorHandler em caso de erro no banco (GET ALL)', async () => {
    jest.spyOn(orderModel, 'getAll').mockRejectedValueOnce(new Error('Falha no banco'));
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(500);
  });
});
