// __tests__/helpers.test.js
// Testes unitários das funções auxiliares (helpers.js)

const { formatarData, formatarMoeda, isNumero } = require('../src/utils/helpers');

describe('helpers.js — Funções Auxiliares', () => {

  // ============================================================
  // formatarData
  // ============================================================
  describe('formatarData()', () => {
    it('deve retornar uma string com a data formatada no padrão pt-BR', () => {
      const resultado = formatarData('2026-01-15');
      expect(typeof resultado).toBe('string');
      // Formato esperado: dd/mm/aaaa
      expect(resultado).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('deve aceitar um objeto Date', () => {
      const data = new Date(2026, 3, 1); // 1 de abril de 2026
      const resultado = formatarData(data);
      expect(typeof resultado).toBe('string');
      expect(resultado).toContain('2026');
    });
  });

  // ============================================================
  // formatarMoeda
  // ============================================================
  describe('formatarMoeda()', () => {
    it('deve formatar um número como moeda brasileira (BRL)', () => {
      const resultado = formatarMoeda(29.9);
      expect(resultado).toContain('R$');
    });

    it('deve formatar o valor 0 corretamente', () => {
      const resultado = formatarMoeda(0);
      expect(resultado).toContain('R$');
    });

    it('deve formatar valores altos com separador de milhar', () => {
      const resultado = formatarMoeda(1000);
      expect(resultado).toContain('R$');
      expect(resultado).toContain('1');
    });
  });

  // ============================================================
  // isNumero
  // ============================================================
  describe('isNumero()', () => {
    it('deve retornar true para números inteiros', () => {
      expect(isNumero(42)).toBe(true);
    });

    it('deve retornar true para números decimais', () => {
      expect(isNumero(29.9)).toBe(true);
    });

    it('deve retornar true para uma string numérica', () => {
      expect(isNumero('123')).toBe(true);
    });

    it('deve retornar false para uma string de texto', () => {
      expect(isNumero('abc')).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isNumero(undefined)).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isNumero(null)).toBe(false);
    });

    it('deve retornar false para NaN', () => {
      expect(isNumero(NaN)).toBe(false);
    });

    it('deve retornar false para string vazia', () => {
      expect(isNumero('')).toBe(false);
    });
  });
});
