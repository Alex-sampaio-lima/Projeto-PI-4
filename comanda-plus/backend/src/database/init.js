// src/database/init.js
// Cria as tabelas do banco SQLite e insere dados mock iniciais

const db = require('./db');

/**
 * Executa uma query SQL que não retorna dados (CREATE, INSERT, etc.)
 * Retorna uma Promise para uso com async/await
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

/**
 * Executa uma query que retorna um único resultado
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Cria todas as tabelas necessárias
 */
async function criarTabelas() {
  await run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      icone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      imagem TEXT,
      avaliacao REAL DEFAULT 0,
      category_id INTEGER,
      disponivel INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rua TEXT NOT NULL,
      numero TEXT NOT NULL,
      bairro TEXT NOT NULL,
      cidade TEXT NOT NULL,
      estado TEXT NOT NULL,
      cep TEXT NOT NULL,
      complemento TEXT,
      principal INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pendente',
      address_id INTEGER,
      observacao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (address_id) REFERENCES addresses(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      preco_unitario REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  console.log('✅ Tabelas criadas com sucesso!');
}

/**
 * Insere dados mock se o banco estiver vazio
 */
async function inserirDadosMock() {
  const resultado = await get('SELECT COUNT(*) as total FROM categories');
  if (resultado.total > 0) {
    console.log('ℹ️  Dados mock já existem, pulando inserção.');
    return;
  }

  // Categorias
  const categorias = [
    ['Hambúrguer', '🍔'],
    ['Pizza', '🍕'],
    ['Bebidas', '🥤'],
    ['Sobremesas', '🍰'],
    ['Saudável', '🥗'],
  ];

  const catIds = [];
  for (const [nome, icone] of categorias) {
    const r = await run('INSERT INTO categories (nome, icone) VALUES (?, ?)', [nome, icone]);
    catIds.push(r.lastID);
  }

  // Produtos
  const produtos = [
    ['Combo Burguer Bacon', 'Hambúrguer artesanal com bacon crocante, queijo cheddar, alface, tomate e molho especial.', 29.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.8, catIds[0]],
    ['Big Beef Flavor', 'Dois hambúrgueres de carne angus, queijo americano, picles e molho especial.', 34.90, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', 4.6, catIds[0]],
    ['Chicken Crispy', 'Frango empanado crocante, maionese de alho, alface americana e tomate cereja.', 24.90, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', 4.5, catIds[0]],
    ['Pizza Margherita', 'Molho de tomate, muçarela fresca, manjericão e azeite. Clássica e irresistível.', 42.90, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 4.7, catIds[1]],
    ['Pizza Pepperoni', 'Molho de tomate, muçarela e pedaços generosos de pepperoni defumado.', 47.90, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 4.9, catIds[1]],
    ['Coca-Cola 600ml', 'Refrigerante gelado, a combinação perfeita com seu pedido.', 8.90, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', 4.4, catIds[2]],
    ['Suco de Laranja', 'Suco natural de laranja, sem adição de açúcar, 500ml.', 11.90, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', 4.6, catIds[2]],
    ['Torta de Chocolate', 'Fatia generosa de torta de chocolate com ganache e chantilly.', 16.90, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 4.8, catIds[3]],
    ['Bowl Frango Grelhado', 'Bowl saudável com frango grelhado, arroz integral, brócolis e molho tahine.', 31.90, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 4.7, catIds[4]],
    ['Salada Caesar', 'Alface romana, croutons, parmesão e molho caesar tradicional.', 22.90, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', 4.5, catIds[4]],
  ];

  for (const produto of produtos) {
    await run(
      'INSERT INTO products (nome, descricao, preco, imagem, avaliacao, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      produto
    );
  }

  // Endereço de exemplo
  await run(
    'INSERT INTO addresses (rua, numero, bairro, cidade, estado, cep, principal) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01310-100', 1]
  );

  console.log('✅ Dados mock inseridos com sucesso!');
}

/**
 * Função principal — inicializa banco, tabelas e dados mock
 */
async function inicializarBanco() {
  try {
    await criarTabelas();
    await inserirDadosMock();
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err.message);
    process.exit(1);
  }
}

module.exports = { inicializarBanco };
