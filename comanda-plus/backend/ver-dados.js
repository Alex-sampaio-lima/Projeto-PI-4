const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('--- EXIBINDO DADOS DO BANCO ---');

db.serialize(() => {
  // Ver usuários
  db.all("SELECT id, nome, email FROM users", [], (err, rows) => {
    if (err) {
      console.error('Erro ao ler usuários:', err.message);
      return;
    }
    console.log('\nTABELA: USERS');
    console.table(rows);
  });

  // Ver produtos
  db.all("SELECT id, nome, preco, category_id FROM products LIMIT 5", [], (err, rows) => {
    if (err) return;
    console.log('\nTABELA: PRODUCTS (Primeiros 5)');
    console.table(rows);
  });

  // Ver pedidos
  db.all("SELECT id, total, status, created_at FROM orders", [], (err, rows) => {
    if (err) return;
    console.log('\nTABELA: ORDERS');
    console.table(rows);
  });
});

// Fecha a conexão após um tempo para dar tempo das queries terminarem
setTimeout(() => {
  db.close();
  console.log('\n--- FIM DO DUMP ---');
}, 1000);
