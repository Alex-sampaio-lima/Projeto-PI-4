// src/utils/format.js
// Funções de formatação reutilizáveis no frontend

/**
 * Formata um número para moeda brasileira
 * @param {number} valor
 * @returns {string} Ex: "R$ 29,90"
 */
export function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

/**
 * Formata uma data ISO para o padrão brasileiro
 * @param {string} dataISO
 * @returns {string} Ex: "01/04/2026"
 */
export function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR');
}

/**
 * Formata endereço completo em uma string
 * @param {object} endereco
 * @returns {string} Ex: "Rua das Flores, 123 — Centro, São Paulo/SP"
 */
export function formatarEndereco(endereco) {
  if (!endereco) return '';
  const complemento = endereco.complemento ? `, ${endereco.complemento}` : '';
  return `${endereco.rua}, ${endereco.numero}${complemento} — ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}`;
}

/**
 * Formata a avaliação em estrelas (texto)
 * @param {number} avaliacao
 * @returns {string} Ex: "⭐ 4.8"
 */
export function formatarAvaliacao(avaliacao) {
  if (!avaliacao) return '⭐ 0.0';
  return `⭐ ${Number(avaliacao).toFixed(1)}`;
}
