// __tests__/errorHandler.test.js
// Testes unitários do middleware de tratamento de erros

const errorHandler = require('../src/middlewares/errorHandler');

describe('errorHandler — Middleware de Erros', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    // Suprime console.error durante os testes
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve responder com status 500 quando o erro não tem status definido', () => {
    const erro = new Error('Algo deu errado');
    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        sucesso: false,
        mensagem: 'Algo deu errado',
      })
    );
  });

  it('deve usar o status HTTP definido no erro', () => {
    const erro = new Error('Não autorizado');
    erro.status = 401;
    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        sucesso: false,
        mensagem: 'Não autorizado',
      })
    );
  });

  it('deve retornar mensagem padrão quando err.message não existe', () => {
    const erro = {};
    errorHandler(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
      })
    );
  });

  it('deve incluir stack trace apenas em modo de desenvolvimento', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const erro = new Error('Erro com stack');
    errorHandler(erro, req, res, next);

    const chamada = res.json.mock.calls[0][0];
    expect(chamada).toHaveProperty('stack');

    process.env.NODE_ENV = originalEnv;
  });

  it('não deve incluir stack trace em ambiente de teste/produção', () => {
    process.env.NODE_ENV = 'test';

    const erro = new Error('Erro sem stack visível');
    errorHandler(erro, req, res, next);

    const chamada = res.json.mock.calls[0][0];
    expect(chamada).not.toHaveProperty('stack');
  });
});
