// src/database/init.js
// Cria as tabelas do banco SQLite e insere dados mock iniciais

const { db } = require('./db');
const userModel = require('../models/userModel');

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

  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      imagem TEXT,
      avaliacao REAL DEFAULT 0,
      category_id INTEGER,
      company_id INTEGER,
      disponivel INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (company_id) REFERENCES companies(id)
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
      company_id INTEGER,
      observacao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (address_id) REFERENCES addresses(id),
      FOREIGN KEY (company_id) REFERENCES companies(id)
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

  // Adiciona colunas se não existirem (para migração simples em dev)
  try {
    await run('ALTER TABLE products ADD COLUMN company_id INTEGER REFERENCES companies(id)');
  } catch (e) {}
  try {
    await run('ALTER TABLE orders ADD COLUMN company_id INTEGER REFERENCES companies(id)');
  } catch (e) {}

  // Tabela de usuários
  await userModel.criarTabela();

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

  // Empresas
  const empresas = [
    ['Burger King', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', '20-30 min', 5.90, 4.5, 'Hambúrguer'],
    ['Dominos Pizza', 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=200', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', '35-45 min', 0.00, 4.7, 'Pizza'],
    ['Saúde no Copo', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', '15-25 min', 7.50, 4.8, 'Saudável'],
  ];

  const empIds = [];
  for (const emp of empresas) {
    const r = await run('INSERT INTO companies (nome, logo, banner, tempo_entrega, frete, avaliacao, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)', emp);
    empIds.push(r.lastID);
  }

  // Produtos
  const produtos = [
    ['Combo Burguer Bacon', 'Hambúrguer artesanal com bacon crocante, queijo cheddar.', 29.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.8, catIds[0], empIds[0]],
    ['Big Beef Flavor', 'Dois hambúrgueres de carne angus.', 34.90, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', 4.6, catIds[0], empIds[0]],
    ['Pizza Margherita', 'Clássica e irresistível.', 42.90, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 4.7, catIds[1], empIds[1]],
    ['Pizza Pepperoni', 'Pepperoni defumado.', 47.90, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 4.9, catIds[1], empIds[1]],
    ['Bowl Frango Grelhado', 'Bowl saudável.', 31.90, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 4.7, catIds[4], empIds[2]],
  ];

  for (const produto of produtos) {
    await run(
      'INSERT INTO products (nome, descricao, preco, imagem, avaliacao, category_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
 * Garante que existe pelo menos um usuário de teste no banco
 */
async function inserirUsuarioTeste() {
  const existente = await get("SELECT id FROM users WHERE email = 'teste@comanda.com'");
  if (existente) return;

  await userModel.create({
    nome: 'Usuário Teste',
    email: 'teste@comanda.com',
    senha: 'senha123',
  });

  console.log('👤 Usuário de teste criado:');
  console.log('   E-mail : teste@comanda.com');
  console.log('   Senha  : senha123');
}

/**
 * Função principal — inicializa banco, tabelas e dados mock
 */
async function inicializarBanco() {
  try {
    await criarTabelas();
    await inserirDadosMock();
    await inserirUsuarioTeste();
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err.message);
    throw err;
  }
}

module.exports = { inicializarBanco };
