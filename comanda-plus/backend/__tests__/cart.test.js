// __tests__/cart.test.js
const { setupTestDB, teardownTestDB } = require('./bootstrap')('cart');
const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => {
  await setupTestDB('cart');
});

afterAll(async () => {
  await teardownTestDB('cart');
});

describe('Endpoints do Carrinho (/api/cart)', () => {
  it('GET /api/cart — deve retornar o carrinho', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body).toHaveProperty('dados');
  });

  it('POST /api/cart — deve adicionar um produto', async () => {
    const res = await request(app).post('/api/cart').send({ product_id: 1, quantidade: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.dados.product_id).toBe(1);
    expect(res.body.dados.quantidade).toBe(2);
  });

  it('POST /api/cart — deve retornar 400 sem product_id', async () => {
    const res = await request(app).post('/api/cart').send({ quantidade: 1 });
    expect(res.statusCode).toBe(400);
  });

  it('DELETE /api/cart/:product_id — deve remover um item do carrinho', async () => {
    await request(app).post('/api/cart').send({ product_id: 1, quantidade: 1 });
    const res = await request(app).delete('/api/cart/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
  });

  it('DELETE /api/cart/clear — deve limpar o carrinho', async () => {
    await request(app).post('/api/cart').send({ product_id: 2, quantidade: 3 });
    const res = await request(app).delete('/api/cart/clear');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    
    const check = await request(app).get('/api/cart');
    expect(check.body.dados.itens.length).toBe(0);
  });
});
