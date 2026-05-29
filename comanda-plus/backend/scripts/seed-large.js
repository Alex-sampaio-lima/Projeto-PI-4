// scripts/seed-large.js
// Gera 200 pedidos mock de alta qualidade distribuídos em 2025/2026 para análise estatística no Google Colab

const { db, run, get, all } = require('../src/config/database');

const FORMAS_PAGAMENTO = ['pix', 'credito', 'debito', 'boleto'];
const STATUS_POSSIVEIS = ['concluido', 'concluido', 'concluido', 'cancelado']; // 75% concluídos, 25% cancelados

const NOMES_CLIENTES = [
  'Ana Silva', 'Carlos Souza', 'Beatriz Santos', 'Daniel Oliveira', 'Eduarda Lima',
  'Felipe Costa', 'Gabriela Gomes', 'Henrique Pereira', 'Isabela Alves', 'João Rodrigues',
  'Julia Ribeiro', 'Lucas Martins', 'Mariana Carvalho', 'Mateus Almeida', 'Patricia Melo',
  'Pedro Cardoso', 'Amanda Santos', 'Bruno Rocha', 'Camila Ferreira', 'Diego Araujo',
  'Fernanda Nogueira', 'Gustavo Lima', 'Juliana Castro', 'Leonardo Cruz', 'Luana Pires',
  'Marcelo Teixeira', 'Renata Barbosa', 'Rodrigo Mendes', 'Sofia Garcia', 'Thiago Moreira'
];

const OBSERVACOES = [
  'Sem cebola, por favor.',
  'Entregar na recepção.',
  'Caprichar no guardanapo.',
  'Deixar com o porteiro.',
  'Molho extra.',
  'Favor trazer troco para R$ 100.',
  'Sem gelo na bebida.',
  'Ponto bem passado.',
  '', // Vazia também é realista
  ''
];

// Helper para converter data para string formatada do SQLite (YYYY-MM-DD HH:MM:SS)
function formatDateForSqlite(date) {
  const pad = (num) => String(num).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

async function main() {
  console.log('🚀 Iniciando seeding estatístico para o Google Colab...');

  // Garante de forma segura que a coluna 'forma_pagamento' existe na tabela 'orders'
  try {
    await run('ALTER TABLE orders ADD COLUMN forma_pagamento TEXT');
    console.log("✅ Coluna 'forma_pagamento' adicionada de forma segura na tabela orders.");
  } catch (e) {
    // Silencia se a coluna já existir
  }

  try {
    // 1. Garantir que as categorias essenciais existem
    const categories = [
      ['Hambúrguer', '🍔'],
      ['Pizza', '🍕'],
      ['Bebidas', '🥤'],
      ['Sobremesas', '🍰'],
      ['Saudável', '🥗'],
    ];

    console.log('📦 Verificando categorias...');
    const catIds = {};
    for (const [nome, icone] of categories) {
      let cat = await get('SELECT id FROM categories WHERE nome = ?', [nome]);
      if (!cat) {
        const r = await run('INSERT INTO categories (nome, icone) VALUES (?, ?)', [nome, icone]);
        catIds[nome] = r.lastID;
        console.log(`✅ Categoria criada: ${nome}`);
      } else {
        catIds[nome] = cat.id;
      }
    }

    // 2. Garantir que as 11 empresas existem no banco
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

    console.log('🏬 Verificando empresas...');
    const empIds = {};
    for (const emp of empresas) {
      let company = await get('SELECT id FROM companies WHERE nome = ?', [emp[0]]);
      if (!company) {
        const r = await run('INSERT INTO companies (nome, logo, banner, tempo_entrega, frete, avaliacao, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)', emp);
        empIds[emp[0]] = r.lastID;
        console.log(`` + `✅ Empresa criada: ${emp[0]} (ID: ${r.lastID})`);
      } else {
        empIds[emp[0]] = company.id;
      }
    }

    // 3. Garantir que os produtos fundamentais existem
    const produtos = [
      ['Combo Burguer Bacon', 'Hambúrguer artesanal com bacon crocante, queijo cheddar.', 29.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.8, catIds['Hambúrguer'], empIds['Burger King']],
      ['Big Beef Flavor', 'Dois hambúrgueres de carne angus.', 34.90, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', 4.6, catIds['Hambúrguer'], empIds['Burger King']],
      ['Pizza Margherita', 'Clássica e irresistível.', 42.90, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 4.7, catIds['Pizza'], empIds['Dominos Pizza']],
      ['Pizza Pepperoni', 'Pepperoni defumado.', 47.90, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 4.9, catIds['Pizza'], empIds['Dominos Pizza']],
      ['Bowl Frango Grelhado', 'Bowl saudável.', 31.90, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 4.7, catIds['Saudável'], empIds['Saúde no Copo']],
      ['Gelato 500ml', 'Sabor Bacio di Latte clássico.', 45.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 4.9, catIds['Sobremesas'], empIds['Bacio di Latte']],
      ['Picolé de Pistache', 'Pistache italiano original.', 14.50, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400', 4.8, catIds['Sobremesas'], empIds['Bacio di Latte']],
      ['Coca-Cola 2L', 'Gelada e refrescante.', 12.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', 4.6, catIds['Bebidas'], empIds['Adega 24h']],
      ['Cerveja Heineken 330ml', 'Long neck gelada.', 8.90, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', 4.7, catIds['Bebidas'], empIds['Adega 24h']],
      ['Vinho Tinto Chileno', 'Cabernet Sauvignon 750ml.', 55.00, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', 4.8, catIds['Bebidas'], empIds['Adega 24h']],

      ['Big Mac Combo', 'O clássico dois hambúrgueres, alface, queijo, molho especial, cebola e picles.', 32.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.5, catIds['Hambúrguer'], empIds["McDonald's"]],
      ['Batata Frita Média', 'Batatas crocantes e douradas, salgadas na medida certa.', 11.90, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 4.6, catIds['Hambúrguer'], empIds["McDonald's"]],

      ['Sub Frango Teriyaki 15cm', 'Frango em tiras com molho teriyaki, queijo derretido e vegetais frescos.', 24.90, 'https://images.unsplash.com/photo-1540713434306-53f2485e4951?w=400', 4.4, catIds['Saudável'], empIds['Subway']],
      ['Cookie de Chocolate', 'Cookie macio com gotas de chocolate premium derretendo.', 6.50, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', 4.8, catIds['Saudável'], empIds['Subway']],

      ['Pizza Suprema Pan', 'Molho de tomate, pepperoni, cebola, pimentão, champignon e queijo.', 49.90, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.6, catIds['Pizza'], empIds['Pizza Hut']],
      ['Pão de Alho Supremo', 'Fatias de pão com manteiga de alho e cobertura generosa de queijo gratinado.', 15.90, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400', 4.5, catIds['Pizza'], empIds['Pizza Hut']],

      ['Combo Temaki & Rolls', '1 Temaki de Salmão Completo com cebolinha e cream cheese + 8 unidades de Uramaki Philadelphia.', 48.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 4.8, catIds['Saudável'], empIds['Sushibar Premium']],
      ['Sunomono Especial', 'Salada refrescante de pepino agridoce com gergelim preto e branco e pedaços de kani.', 14.90, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 4.6, catIds['Saudável'], empIds['Sushibar Premium']],

      ['Frappuccino de Caramelo', 'Café batido com gelo e leite, coberto com chantilly e uma calda deliciosa de caramelo.', 19.90, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 4.7, catIds['Bebidas'], empIds['Starbucks Café']],
      ['Croissant de Manteiga', 'Croissant folhado clássico amanteigado, crocante por fora e macio por dentro.', 10.90, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 4.6, catIds['Bebidas'], empIds['Starbucks Café']],

      ['Fatia Bolo Brigadeiro', 'Bolo de chocolate molhadinho com recheio e cobertura cremosos de brigadeiro gourmet.', 16.90, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400', 4.8, catIds['Sobremesas'], empIds['Amor aos Pedaços']],
      ['Torta de Limão', 'Massa crocante sablé com creme de limão siciliano azedinho e merengue italiano tostado.', 14.90, 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400', 4.7, catIds['Sobremesas'], empIds['Amor aos Pedaços']]
    ];

    console.log('🍕 Verificando produtos...');
    for (const prod of produtos) {
      let p = await get('SELECT id FROM products WHERE nome = ?', [prod[0]]);
      if (!p) {
        await run('INSERT INTO products (nome, descricao, preco, imagem, avaliacao, category_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)', prod);
        console.log(`✅ Produto criado: ${prod[0]}`);
      }
    }

    // 4. Limpar e preencher bairros (Regiões)
    console.log('🧹 Limpando endereços para padronização de bairros...');
    await run('DELETE FROM order_items');
    await run('DELETE FROM orders');
    await run('DELETE FROM addresses');

    const bairros = ['Centro', 'Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste'];
    const addressesIds = [];
    for (const bairro of bairros) {
      const r = await run(
        'INSERT INTO addresses (rua, numero, bairro, cidade, estado, cep, principal) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [`Avenida das Nações, ${bairro}`, '100', bairro, 'São Paulo', 'SP', '01000-000', bairro === 'Centro' ? 1 : 0]
      );
      addressesIds.push(r.lastID);
      console.log(`✅ Endereço inserido para região: ${bairro} (ID: ${r.lastID})`);
    }

    // 5. Buscar empresas e produtos completos do banco para vincular perfeitamente
    const dbCompanies = await all('SELECT id, nome, frete FROM companies');
    const dbProducts = await all('SELECT id, nome, preco, company_id FROM products');

    console.log('⏳ Gerando 200 pedidos realistas ao longo de 2025/2026...');

    const totalPedidos = 200;
    const totalDias = 730; // 365 * 2 anos (2025 e 2026)

    // Data de início: 2025-01-01
    const baseDate = new Date('2025-01-01T12:00:00');

    for (let i = 0; i < totalPedidos; i++) {
      // 5.1 Distribuição linear ao longo dos 730 dias com um pequeno jitter aleatório (+/- 10 dias)
      const dayFraction = i / totalPedidos;
      const targetDay = Math.floor(dayFraction * totalDias);
      const jitter = Math.floor(Math.random() * 21) - 10; // -10 a +10
      let finalDay = targetDay + jitter;

      if (finalDay < 0) finalDay = 0;
      if (finalDay >= totalDias) finalDay = totalDias - 1;

      // Cria a data correspondente
      const orderDate = new Date(baseDate.getTime());
      orderDate.setDate(orderDate.getDate() + finalDay);

      // Sazonalidade de fim de semana (aumenta chances de pedidos no sex, sab, dom)
      const diaSemana = orderDate.getDay(); // 0: Dom, 6: Sab, 5: Sex
      const isWeekend = [0, 5, 6].includes(diaSemana);

      // Definir horário de pico realista (almoço ou jantar)
      let hour;
      if (Math.random() < 0.35) {
        hour = Math.floor(Math.random() * 3) + 11; // 11h - 13h
      } else {
        hour = Math.floor(Math.random() * 5) + 18; // 18h - 22h
      }
      orderDate.setHours(hour);
      orderDate.setMinutes(Math.floor(Math.random() * 60));
      orderDate.setSeconds(Math.floor(Math.random() * 60));

      // 5.2 Selecionar empresa aleatória
      const company = dbCompanies[Math.floor(Math.random() * dbCompanies.length)];

      // 5.3 Selecionar endereço (Região) aleatório
      const addressId = addressesIds[Math.floor(Math.random() * addressesIds.length)];

      // 5.4 Selecionar forma de pagamento
      const forma_pagamento = FORMAS_PAGAMENTO[Math.floor(Math.random() * FORMAS_PAGAMENTO.length)];
      const status = STATUS_POSSIVEIS[Math.floor(Math.random() * STATUS_POSSIVEIS.length)];
      const observacao = OBSERVACOES[Math.floor(Math.random() * OBSERVACOES.length)];

      // 5.5 Encontrar produtos dessa empresa
      const productsOfCompany = dbProducts.filter(p => p.company_id === company.id);

      if (productsOfCompany.length === 0) {
        console.warn(`⚠️  Empresa ${company.nome} não tem produtos vinculados! Pulando pedido.`);
        continue;
      }

      // Escolher de 1 a 3 itens aleatórios da mesma empresa
      const numItems = Math.min(productsOfCompany.length, Math.floor(Math.random() * 3) + 1);
      
      // Shuffle nos produtos para pegar itens aleatórios sem repetição de produto no mesmo pedido
      const shuffledProds = [...productsOfCompany].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffledProds.slice(0, numItems);

      let totalPedido = 0;
      const orderItemsToInsert = [];

      for (const prod of selectedProducts) {
        const quantidade = Math.floor(Math.random() * 2) + 1; // 1 ou 2 de cada
        const subtotal = quantidade * prod.preco;
        totalPedido += subtotal;

        orderItemsToInsert.push({
          product_id: prod.id,
          quantidade,
          preco_unitario: prod.preco
        });
      }

      // Adiciona o valor do frete ao total
      totalPedido += company.frete;
      // Garante precisão decimal
      totalPedido = parseFloat(totalPedido.toFixed(2));

      // 5.6 Inserir pedido no banco
      const orderResult = await run(
        `INSERT INTO orders (total, status, address_id, company_id, observacao, forma_pagamento, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [totalPedido, status, addressId, company.id, observacao, forma_pagamento, formatDateForSqlite(orderDate)]
      );

      const orderId = orderResult.lastID;

      // 5.7 Inserir itens do pedido
      for (const item of orderItemsToInsert) {
        await run(
          `INSERT INTO order_items (order_id, product_id, quantidade, preco_unitario)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantidade, item.preco_unitario]
        );
      }
    }

    // Mostrar resumo
    const totalOrd = await get('SELECT COUNT(*) as total FROM orders');
    const totalItm = await get('SELECT COUNT(*) as total FROM order_items');
    console.log(`\n🎉 Banco estatístico populado com sucesso!`);
    console.log(`📊 Total de pedidos criados: ${totalOrd.total} registros.`);
    console.log(`🛒 Total de itens vendidos:   ${totalItm.total} registros.`);
    console.log(`📅 Período abrangido:        2025-01-01 a 2026-12-31.`);
    
    db.close();
  } catch (error) {
    console.error('❌ Erro crítico durante o seeding:', error.message);
    db.close();
    process.exit(1);
  }
}

main();
