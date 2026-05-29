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
    CREATE TABLE IF NOT EXISTS payment_methods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      bandeira TEXT,
      final TEXT,
      icone TEXT,
      principal INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1,
      observacao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      frete REAL DEFAULT 0,
      status TEXT DEFAULT 'pendente',
      address_id INTEGER,
      company_id INTEGER,
      observacao TEXT,
      forma_pagamento TEXT,
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
      observacao TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Adiciona colunas se não existirem (para migração simples in dev)
  try {
    await run('ALTER TABLE products ADD COLUMN company_id INTEGER REFERENCES companies(id)');
  } catch (e) {}
  try {
    await run('ALTER TABLE orders ADD COLUMN company_id INTEGER REFERENCES companies(id)');
  } catch (e) {}
  try {
    await run('ALTER TABLE orders ADD COLUMN forma_pagamento TEXT');
  } catch (e) {}
  try {
    await run('ALTER TABLE orders ADD COLUMN frete REAL DEFAULT 0');
  } catch (e) {}
  try {
    await run('ALTER TABLE cart ADD COLUMN observacao TEXT');
  } catch (e) {}
  try {
    await run('ALTER TABLE order_items ADD COLUMN observacao TEXT');
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
    ['Bacio di Latte', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A7p8P9z3Z2N_I5P5k0L-M_6xXQnF5r9_WA&s', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800', '20-35 min', 4.90, 4.9, 'Sobremesas'],
    ['Adega 24h', 'https://previews.123rf.com/images/vectorv/vectorv1908/vectorv190833113/129215777-wine-bottle-icon-design-template-vector-isolated.jpg', 'https://images.unsplash.com/photo-1528823872057-9c018a7a72b5?w=800', '15-25 min', 0.00, 4.6, 'Bebidas'],
    ["McDonald's", 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=200', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', '15-25 min', 4.90, 4.3, 'Hambúrguer'],
    ['Subway', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200', 'https://images.unsplash.com/photo-1540713434306-53f2485e4951?w=800', '20-30 min', 5.00, 4.4, 'Saudável'],
    ['Pizza Hut', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800', '30-40 min', 6.90, 4.5, 'Pizza'],
    ['Sushibar Premium', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800', '40-50 min', 8.90, 4.8, 'Saudável'],
    ['Starbucks Café', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200', 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800', '10-20 min', 3.90, 4.7, 'Bebidas'],
    ['Amor aos Pedaços', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800', '15-25 min', 5.90, 4.6, 'Sobremesas']
  ];

  const empIds = [];
  for (const emp of empresas) {
    const r = await run('INSERT INTO companies (nome, logo, banner, tempo_entrega, frete, avaliacao, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)', emp);
    empIds.push(r.lastID);
  }

  // Produtos
  const produtos = [
    // Hambúrguer — Burger King (empIds[0])
    ['Combo Burguer Bacon', 'Hambúrguer artesanal com bacon crocante, queijo cheddar.', 29.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.8, catIds[0], empIds[0]],
    ['Big Beef Flavor', 'Dois hambúrgueres de carne angus.', 34.90, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', 4.6, catIds[0], empIds[0]],
    
    // Pizza — Dominos (empIds[1])
    ['Pizza Margherita', 'Clássica e irresistível.', 42.90, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 4.7, catIds[1], empIds[1]],
    ['Pizza Pepperoni', 'Pepperoni defumado.', 47.90, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 4.9, catIds[1], empIds[1]],
    
    // Saudável — Saúde no Copo (empIds[2])
    ['Bowl Frango Grelhado', 'Bowl saudável.', 31.90, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 4.7, catIds[4], empIds[2]],
    
    // Sobremesas — Bacio di Latte (empIds[3])
    ['Gelato 500ml', 'Sabor Bacio di Latte clássico.', 45.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 4.9, catIds[3], empIds[3]],
    ['Picolé de Pistache', 'Pistache italiano original.', 14.50, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400', 4.8, catIds[3], empIds[3]],
    
    // Bebidas — Adega 24h (empIds[4])
    ['Coca-Cola 2L', 'Gelada e refrescante.', 12.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', 4.6, catIds[2], empIds[4]],
    ['Cerveja Heineken 330ml', 'Long neck gelada.', 8.90, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', 4.7, catIds[2], empIds[4]],
    ['Vinho Tinto Chileno', 'Cabernet Sauvignon 750ml.', 55.00, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', 4.8, catIds[2], empIds[4]],

    // McDonald's (empIds[5])
    ['Big Mac Combo', 'O clássico dois hambúrgueres, alface, queijo, molho especial, cebola e picles.', 32.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.5, catIds[0], empIds[5]],
    ['Batata Frita Média', 'Batatas crocantes e douradas, salgadas na medida certa.', 11.90, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 4.6, catIds[0], empIds[5]],

    // Subway (empIds[6])
    ['Sub Frango Teriyaki 15cm', 'Frango em tiras com molho teriyaki, queijo derretido e vegetais frescos.', 24.90, 'https://images.unsplash.com/photo-1540713434306-53f2485e4951?w=400', 4.4, catIds[4], empIds[6]],
    ['Cookie de Chocolate', 'Cookie macio com gotas de chocolate premium derretendo.', 6.50, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', 4.8, catIds[4], empIds[6]],

    // Pizza Hut (empIds[7])
    ['Pizza Suprema Pan', 'Molho de tomate, pepperoni, cebola, pimentão, champignon e queijo.', 49.90, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.6, catIds[1], empIds[7]],
    ['Pão de Alho Supremo', 'Fatias de pão com manteiga de alho e cobertura generosa de queijo gratinado.', 15.90, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400', 4.5, catIds[1], empIds[7]],

    // Sushibar Premium (empIds[8])
    ['Combo Temaki & Rolls', '1 Temaki de Salmão Completo com cebolinha e cream cheese + 8 unidades de Uramaki Philadelphia.', 48.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 4.8, catIds[4], empIds[8]],
    ['Sunomono Especial', 'Salada refrescante de pepino agridoce com gergelim preto e branco e pedaços de kani.', 14.90, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 4.6, catIds[4], empIds[8]],

    // Starbucks Café (empIds[9])
    ['Frappuccino de Caramelo', 'Café batido com gelo e leite, coberto com chantilly e uma calda deliciosa de caramelo.', 19.90, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 4.7, catIds[2], empIds[9]],
    ['Croissant de Manteiga', 'Croissant folhado clássico amanteigado, crocante por fora e macio por dentro.', 10.90, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 4.6, catIds[2], empIds[9]],

    // Amor aos Pedaços (empIds[10])
    ['Fatia Bolo Brigadeiro', 'Bolo de chocolate molhadinho com recheio e cobertura cremosos de brigadeiro gourmet.', 16.90, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400', 4.8, catIds[3], empIds[10]],
    ['Torta de Limão', 'Massa crocante sablé com creme de limão siciliano azedinho e merengue italiano tostado.', 14.90, 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400', 4.7, catIds[3], empIds[10]]
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
 * Garante que existem formas de pagamento mock no banco de dados
 */
async function inserirMetodosPagamentoMock() {
  const metodosMockResultado = await get('SELECT COUNT(*) as total FROM payment_methods');
  if (metodosMockResultado.total > 0) return;

  const metodos = [
    ['Crédito', 'Visa', '1234', '💳', 1],
    ['Crédito', 'Mastercard', '5678', '💳', 0],
    ['PIX', 'Saldo na conta', '', '💠', 0]
  ];
  for (const [tipo, bandeira, final, icone, principal] of metodos) {
    await run(
      'INSERT INTO payment_methods (tipo, bandeira, final, icone, principal) VALUES (?, ?, ?, ?, ?)',
      [tipo, bandeira, final, icone, principal]
    );
  }

  console.log('💳 Formas de pagamento mock inseridas com sucesso!');
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
    await inserirMetodosPagamentoMock();
    await inserirUsuarioTeste();
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err.message);
    throw err;
  }
}

module.exports = { inicializarBanco };
