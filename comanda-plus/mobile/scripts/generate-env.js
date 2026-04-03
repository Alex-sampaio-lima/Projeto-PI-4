const os = require('os');
const fs = require('fs');
const path = require('path');

/**
 * Script para detectar o IP local da máquina e atualizar automaticamente o .env do mobile.
 * Isso garante que todos no time consigam rodar o projeto sem mexer no IP manualmente.
 */

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pula endereços internos (127.0.0.1) e que não sejam IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const envPath = path.join(__dirname, '..', '.env');
const apiUrl = `http://${localIP}:3000/api`;

// Conteúdo básico do .env
const envContent = `################################################################################
# ARQUIVO GERADO AUTOMATICAMENTE POR: node scripts/generate-env.js
# NÃO EDITE ESTE ARQUIVO MANUALMENTE (IP : ${localIP})
################################################################################

EXPO_PUBLIC_API_URL=${apiUrl}
`;

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ [Scripts] IP Detectado:', localIP);
  console.log('📝 [Scripts] .env atualizado com:', apiUrl);
  
  // Inicia o Expo injetando o HOSTNAME dinamicamente para garantir que o QR Code use o IP correto
  console.log('🚀 [Scripts] Iniciando Expo...');
  
  const { spawn } = require('child_process');
  const env = { ...process.env, REACT_NATIVE_PACKAGER_HOSTNAME: localIP };
  
  const expoProcess = spawn('npx', ['expo', 'start', '--lan'], { 
    stdio: 'inherit', 
    env,
    shell: true 
  });

  expoProcess.on('close', (code) => {
    process.exit(code);
  });

} catch (error) {
  console.error('❌ [Scripts] Erro:', error.message);
}
