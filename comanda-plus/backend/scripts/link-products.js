// scripts/link-products.js — Vincula produtos existentes às empresas
const db = require('../src/config/database');

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
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

async function linkProducts() {
  try {
    const cats = await all('SELECT id, nome FROM categories ORDER BY id ASC');
    console.log('Categorias encontradas:', cats.map(c => `[${c.id}] ${c.nome}`).join(', '));

    const empresas = await all('SELECT id, nome, categoria FROM companies ORDER BY id ASC');
    console.log('Empresas encontradas:', empresas.map(e => `[${e.id}] ${e.nome}`).join(', '));

    const catHamb = cats.find(c => c.nome.toLowerCase().includes('burg') || c.nome.toLowerCase().includes('hamb'));
    const catPizza = cats.find(c => c.nome.toLowerCase().includes('pizza'));
    const empBurger = empresas.find(e => e.categoria === 'Hambúrguer');
    const empPizza = empresas.find(e => e.categoria === 'Pizza');
    const empSaude = empresas.find(e => e.categoria === 'Saudável');

    const produtos = await all('SELECT id, nome, category_id FROM products');
    console.log(`\nVinculando ${produtos.length} produtos...`);

    for (const p of produtos) {
      let empId = empSaude?.id || 3;
      if (catHamb && p.category_id === catHamb.id) empId = empBurger?.id || 1;
      else if (catPizza && p.category_id === catPizza.id) empId = empPizza?.id || 2;

      await run('UPDATE products SET company_id = ? WHERE id = ?', [empId, p.id]);
      console.log(`  ✅ "${p.nome}" → empresa ${empId}`);
    }

    const verificacao = await all('SELECT p.nome, c.nome as empresa FROM products p LEFT JOIN companies c ON p.company_id = c.id');
    console.log('\n📊 Resultado final:');
    verificacao.forEach(v => console.log(`  "${v.nome}" → ${v.empresa || 'SEM EMPRESA'}`));

    db.close();
  } catch (err) {
    console.error('❌ Erro:', err.message);
    db.close();
  }
}

linkProducts();
