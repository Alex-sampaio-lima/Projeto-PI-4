// scripts/export-dashboard.js
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}/api/dashboard/export`;

console.log(`⏳ Gerando estatísticas do Dashboard a partir de ${URL}...`);

http.get(URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const jsonParsed = JSON.parse(data);
        
        // Define o caminho de saída (na pasta raiz do backend)
        const outputPath = path.join(__dirname, '..', 'dashboard-estatisticas.json');
        
        // Salva o arquivo formatado com indentação (2 espaços)
        fs.writeFileSync(outputPath, JSON.stringify(jsonParsed.dados, null, 2), 'utf-8');
        
        console.log(`✅ Sucesso! Os dados foram exportados para: ${outputPath}`);
      } catch (e) {
        console.error('❌ Erro ao analisar a resposta JSON:', e.message);
      }
    } else {
      console.error(`❌ Falha ao buscar dados. Status Code: ${res.statusCode}`);
      console.error(`Verifique se o backend está rodando ("npm run dev").`);
    }
  });
}).on('error', (err) => {
  console.error('❌ Erro ao conectar ao servidor:', err.message);
  console.error('Verifique se o backend está rodando ("npm run dev").');
});
