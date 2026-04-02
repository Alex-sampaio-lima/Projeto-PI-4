// __tests__/products.test.js
const { setupTestDB, teardownTestDB } = require('./bootstrap')('products');
const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => {
  await setupTestDB('products');
});

afterAll(async () => {
  await teardownTestDB('products');
});

describe('Endpoints de Produtos (/api/products)', () => {
  it('GET /api/products — deve retornar lista de produtos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
    expect(res.body.dados.length).toBeGreaterThan(0);
  });

  it('GET /api/products?category_id=1 — deve filtrar por categoria', async () => {
    const res = await request(app).get('/api/products?category_id=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
  });

  it('GET /api/products/:id — deve retornar um produto específico', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.id).toBe(1);
  });

  it('GET /api/products/:id — deve retornar 404 para inexistente', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/products — deve criar um novo produto', async () => {
    const novoProduto = {
      nome: 'Produto Teste Novo',
      descricao: 'Descrição teste',
      preco: 10.5,
      category_id: 1
    };
    const res = await request(app).post('/api/products').send(novoProduto);
    expect(res.statusCode).toBe(201);
    expect(res.body.dados.nome).toBe(novoProduto.nome);
  });

  it('PUT /api/products/:id — deve atualizar um produto', async () => {
    const dadosAtualizados = { nome: 'Produto Atualizado', preco: 25.0 };
    const res = await request(app).put('/api/products/1').send(dadosAtualizados);
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.nome).toBe('Produto Atualizado');
    expect(res.body.dados.preco).toBe(25.0);
  });

  it('PUT /api/products/:id — deve retornar 404 ao atualizar inexistente', async () => {
    const res = await request(app).put('/api/products/9999').send({ nome: 'Erro', preco: 10 });
    expect(res.statusCode).toBe(404);
  });

  it('DELETE /api/products/:id — deve remover um produto', async () => {
    const res = await request(app).delete('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);

    const check = await request(app).get('/api/products/1');
    expect(check.statusCode).toBe(404);
  });

  it('DELETE /api/products/:id — deve retornar 404 ao remover inexistente', async () => {
    const res = await request(app).delete('/api/products/9999');
    expect(res.statusCode).toBe(404);
  });
});
