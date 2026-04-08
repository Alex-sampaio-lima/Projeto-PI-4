// src/services/api.js
// Instância Axios configurada com a URL base da API

import axios from 'axios';
import { Alert } from 'react-native';

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

console.log('📡 API_URL configurada:', API_URL);

// Interceptor de requisição — útil para adicionar logs ou tokens futuros
api.interceptors.request.use(
  (config) => {
    console.log(`📡 Requisição: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta — tratamento global de erros de rede
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 Erro na API:', error?.code, error?.message);
    console.error('🔴 URL tentada:', error?.config?.baseURL + error?.config?.url);
    console.error('🔴 Resposta:', JSON.stringify(error?.response?.data));

    if (error.code === 'ECONNABORTED') {
      Alert.alert(
        'Conexão Lenta',
        'O servidor demorou muito para responder.'
      );
    } else if (!error.response) {
      Alert.alert(
        'Sem Conexão',
        `Não foi possível conectar ao servidor.\nURL: ${error?.config?.baseURL}\n\nVerifique se o backend está rodando e se o IP no .env está correto.`
      );
    }
    return Promise.reject(error);
  }
);

export default api;
