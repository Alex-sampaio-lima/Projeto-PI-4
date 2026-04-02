// __tests__/addresses.test.js
const { setupTestDB, teardownTestDB } = require('./bootstrap')('addresses');
const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => {
  await setupTestDB('addresses');
});

afterAll(async () => {
  await teardownTestDB('addresses');
});

describe('Endpoints de Endereços (/api/addresses)', () => {
  const novoEndereco = {
    rua: 'Rua Teste',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01000-000',
    principal: 1
  };

  it('GET /api/addresses — deve retornar lista de endereços', async () => {
    const res = await request(app).get('/api/addresses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.dados)).toBe(true);
  });

  it('POST /api/addresses — deve criar um novo endereço', async () => {
    const res = await request(app).post('/api/addresses').send(novoEndereco);
    expect(res.statusCode).toBe(201);
    expect(res.body.dados.rua).toBe(novoEndereco.rua);
  });

  it('GET /api/addresses/:id — deve retornar um endereço específico', async () => {
    const res = await request(app).get('/api/addresses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.id).toBe(1);
  });

  it('PUT /api/addresses/:id — deve atualizar um endereço', async () => {
    const dadosAlterados = { ...novoEndereco, rua: 'Rua Alterada' };
    const res = await request(app).put('/api/addresses/1').send(dadosAlterados);
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.rua).toBe('Rua Alterada');
  });

  it('DELETE /api/addresses/:id — deve remover um endereço', async () => {
    const res = await request(app).delete('/api/addresses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);

    const check = await request(app).get('/api/addresses/1');
    expect(check.statusCode).toBe(404);
  });
});
