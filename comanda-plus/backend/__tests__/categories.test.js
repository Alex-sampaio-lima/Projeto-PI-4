// __tests__/categories.test.js
const { setupTestDB, teardownTestDB } = require('./bootstrap')('categories');
const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => {
  await setupTestDB('categories');
});

afterAll(async () => {
  await teardownTestDB('categories');
});

describe('Endpoints de Categorias (/api/categories)', () => {
  it('GET /api/categories — deve retornar lista de categorias', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
    expect(res.body.dados.length).toBeGreaterThan(0);
  });

  it('GET /api/categories/:id — deve retornar uma categoria específica', async () => {
    const res = await request(app).get('/api/categories/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.id).toBe(1);
  });

  it('GET /api/categories/:id — deve retornar 404 para inexistente', async () => {
    const res = await request(app).get('/api/categories/9999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/categories — deve criar uma nova categoria', async () => {
    const novaCategoria = { nome: 'Nova Categoria', icone: '🔥' };
    const res = await request(app).post('/api/categories').send(novaCategoria);
    expect(res.statusCode).toBe(201);
    expect(res.body.dados.nome).toBe(novaCategoria.nome);
  });

  it('POST /api/categories — deve retornar 400 se faltar o nome', async () => {
    const res = await request(app).post('/api/categories').send({ icone: '🔥' });
    expect(res.statusCode).toBe(400);
  });

  it('PUT /api/categories/:id — deve atualizar uma categoria', async () => {
    const res = await request(app).put('/api/categories/1').send({ nome: 'Categoria Alterada' });
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.nome).toBe('Categoria Alterada');
  });

  it('PUT /api/categories/:id — deve retornar 404 ao atualizar inexistente', async () => {
    const res = await request(app).put('/api/categories/9999').send({ nome: 'Erro' });
    expect(res.statusCode).toBe(404);
  });

  it('DELETE /api/categories/:id — deve remover uma categoria', async () => {
    const res = await request(app).delete('/api/categories/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);

    const check = await request(app).get('/api/categories/1');
    expect(check.statusCode).toBe(404);
  });

  it('DELETE /api/categories/:id — deve retornar 404 ao remover inexistente', async () => {
    const res = await request(app).delete('/api/categories/9999');
    expect(res.statusCode).toBe(404);
  });
});
