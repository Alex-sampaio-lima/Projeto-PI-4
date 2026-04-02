// src/services/api.js
// Instância Axios configurada com a URL base da API

import axios from 'axios';

// A URL é definida no arquivo .env como EXPO_PUBLIC_API_URL
// Exemplo: http://192.168.1.10:3000/api
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
// const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição — útil para adicionar logs ou tokens futuros
api.interceptors.request.use(
  (config) => {
    // console.log(`📡 Requisição: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta — tratamento global de erros de rede
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout na requisição para a API');
    } else if (!error.response) {
      console.error('🔌 Sem conexão com o servidor. Verifique se o backend está rodando.');
    }
    return Promise.reject(error);
  }
);

export default api;
