// scripts/seed-user.js
// Cria o usuário de teste manualmente (execute com: node scripts/seed-user.js)

const db = require('../src/config/database');
const userModel = require('../src/models/userModel');

async function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function main() {
  // Garante que a tabela existe
  await userModel.criarTabela();

  const existente = await get("SELECT id FROM users WHERE email = 'teste@comanda.com'");
  if (existente) {
    console.log('ℹ️  Usuário de teste já existe.');
    console.log('   E-mail : teste@comanda.com');
    console.log('   Senha  : senha123');
    process.exit(0);
  }

  await userModel.create({
    nome: 'Usuário Teste',
    email: 'teste@comanda.com',
    senha: 'senha123',
  });

  console.log('✅ Usuário de teste criado com sucesso!');
  console.log('   E-mail : teste@comanda.com');
  console.log('   Senha  : senha123');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
