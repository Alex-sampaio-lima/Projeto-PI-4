// __tests__/orders.test.js
const { setupTestDB, teardownTestDB } = require('./bootstrap')('orders');
const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => {
  await setupTestDB('orders');
});

afterAll(async () => {
  await teardownTestDB('orders');
});

describe('Endpoints de Pedidos (/api/orders)', () => {
  it('GET /api/orders — deve retornar lista de pedidos', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.dados)).toBe(true);
  });

  it('POST /api/orders — deve criar um novo pedido (sucesso)', async () => {
    // Busca um endereço real inserido pelo mock
    const resAddr = await request(app).get('/api/addresses');
    const addressId = resAddr.body.dados[0].id;

    // Adiciona itens ao carrinho primeiro
    await request(app).post('/api/cart').send({ product_id: 1, quantidade: 2 });
    
    const res = await request(app).post('/api/orders').send({ address_id: addressId, observacao: 'Sem cebola' });
    expect(res.statusCode).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('id');
  });

  it('POST /api/orders — deve retornar 400 se o carrinho estiver vazio', async () => {
    await request(app).delete('/api/cart/clear');
    const res = await request(app).post('/api/orders').send({ address_id: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body.mensagem).toContain('vazio');
  });

  it('GET /api/orders/:id — deve retornar um pedido específico', async () => {
    // Cria um pedido para garantir que existe o ID 1
    await request(app).post('/api/cart').send({ product_id: 1, quantidade: 1 });
    const order = await request(app).post('/api/orders').send({ address_id: 1 });
    const orderId = order.body.dados.id;

    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.id).toBe(orderId);
  });

  it('PUT /api/orders/:id/status — deve atualizar o status do pedido', async () => {
    // Garante que existe um pedido (reaproveita ou cria)
    const resList = await request(app).get('/api/orders');
    const orderId = resList.body.dados[0].id;

    const res = await request(app).put(`/api/orders/${orderId}/status`).send({ status: 'em_preparo' });
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.status).toBe('em_preparo');
  });
});
