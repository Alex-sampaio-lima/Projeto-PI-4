// scripts/seed-companies.js — Insere dados de empresas no banco existente
const db = require('../src/config/database');

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function seedCompanies() {
  try {
    // Garante que a tabela existe
    await run(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        logo TEXT,
        banner TEXT,
        tempo_entrega TEXT,
        frete REAL DEFAULT 0,
        avaliacao REAL DEFAULT 0,
        categoria TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Adiciona company_id em products se não existir
    try { await run('ALTER TABLE products ADD COLUMN company_id INTEGER REFERENCES companies(id)'); } catch (e) {}
    // Adiciona company_id em orders se não existir
    try { await run('ALTER TABLE orders ADD COLUMN company_id INTEGER REFERENCES companies(id)'); } catch (e) {}

    // Verifica se já há empresas
    const existentes = await get('SELECT COUNT(*) as total FROM companies');
    if (existentes.total > 0) {
      console.log(`ℹ️  Já existem ${existentes.total} empresa(s) no banco.`);
    } else {
      // Insere empresas mock
      const empresas = [
        ['Burger King', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/400px-Burger_King_2020.svg.png', null, '20-30 min', 5.90, 4.5, 'Hambúrguer'],
        ['Dominos Pizza', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/400px-Domino%27s_pizza_logo.svg.png', null, '35-45 min', 0.00, 4.7, 'Pizza'],
        ['Saúde no Copo', 'https://placehold.co/200x200/22c55e/ffffff?text=SC', null, '15-25 min', 7.50, 4.8, 'Saudável'],
      ];

      const empIds = [];
      for (const emp of empresas) {
        const r = await run('INSERT INTO companies (nome, logo, banner, tempo_entrega, frete, avaliacao, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)', emp);
        empIds.push(r.lastID);
        console.log(`✅ Empresa inserida: ${emp[0]} (ID: ${r.lastID})`);
      }

      // Vincula produtos existentes às empresas
      const produtos = await all('SELECT id, category_id FROM products WHERE company_id IS NULL');
      for (const p of produtos) {
        // Hambúrguer (cat 1) -> Burger King (emp 1), Pizza (cat 2) -> Dominos (emp 2), outros -> Saúde no Copo (emp 3)
        let empId = empIds[2]; // padrão: Saúde no Copo
        if (p.category_id === catIds[0]) empId = empIds[0];
        else if (p.category_id === catIds[1]) empId = empIds[1];
        
        // Pega os IDs das categorias do banco
        const cats = await all('SELECT id, nome FROM categories ORDER BY id ASC');
        const catHamb = cats.find(c => c.nome.includes('burg') || c.nome.includes('Burg'));
        const catPizza = cats.find(c => c.nome.includes('Pizza') || c.nome.includes('pizza'));
        
        let finalEmpId = empIds[2];
        if (catHamb && p.category_id === catHamb.id) finalEmpId = empIds[0];
        else if (catPizza && p.category_id === catPizza.id) finalEmpId = empIds[1];
        
        await run('UPDATE products SET company_id = ? WHERE id = ?', [finalEmpId, p.id]);
      }
      console.log(`✅ ${produtos.length} produto(s) vinculado(s) às empresas.`);
    }

    // Mostra o estado atual
    const todasEmpresas = await all('SELECT id, nome, categoria FROM companies');
    console.log('\n📊 Empresas no banco:');
    todasEmpresas.forEach(e => console.log(`  [${e.id}] ${e.nome} — ${e.categoria}`));

    const todosProdutos = await all('SELECT id, nome, company_id FROM products');
    console.log('\n🍽️  Produtos com empresa:');
    todosProdutos.forEach(p => console.log(`  [${p.id}] ${p.nome} → empresa ${p.company_id || 'SEM EMPRESA'}`));

    db.close();
  } catch (err) {
    console.error('❌ Erro:', err.message);
    db.close();
  }
}

seedCompanies();
