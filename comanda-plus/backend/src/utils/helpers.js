// src/utils/helpers.js
// Funções auxiliares utilizadas no projeto

/**
 * Formata uma data para o padrão brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data formatada (ex: "01/04/2026")
 */
function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata um valor para moeda brasileira
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado (ex: "R$ 29,90")
 */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Verifica se um valor é um número válido
 * @param {any} valor
 * @returns {boolean}
 */
function isNumero(valor) {
  return !isNaN(parseFloat(valor)) && isFinite(valor);
}

module.exports = { formatarData, formatarMoeda, isNumero };
