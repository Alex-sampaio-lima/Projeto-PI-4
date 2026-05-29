// scripts/atualizar-banco.js
// Script para atualizar o banco de dados local com novas empresas e imagens, sem deletar dados existentes

const { db, run, get, all, closeConnection } = require('../src/config/database');

const EMPRESAS = [
  // 5 Empresas Originais (atualização de imagens se necessário)
  {
    nome: 'Burger King',
    logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200',
    banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    tempo_entrega: '20-30 min',
    frete: 5.90,
    avaliacao: 4.5,
    categoria: 'Hambúrguer'
  },
  {
    nome: 'Dominos Pizza',
    logo: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=200',
    banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    tempo_entrega: '35-45 min',
    frete: 0.00,
    avaliacao: 4.7,
    categoria: 'Pizza'
  },
  {
    nome: 'Saúde no Copo',
    logo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200',
    banner: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    tempo_entrega: '15-25 min',
    frete: 7.50,
    avaliacao: 4.8,
    categoria: 'Saudável'
  },
  {
    nome: 'Bacio di Latte',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A7p8P9z3Z2N_I5P5k0L-M_6xXQnF5r9_WA&s',
    banner: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800',
    tempo_entrega: '20-35 min',
    frete: 4.90,
    avaliacao: 4.9,
    categoria: 'Sobremesas'
  },
  {
    nome: 'Adega 24h',
    logo: 'https://previews.123rf.com/images/vectorv/vectorv1908/vectorv190833113/129215777-wine-bottle-icon-design-template-vector-isolated.jpg',
    banner: 'https://images.unsplash.com/photo-1528823872057-9c018a7a72b5?w=800',
    tempo_entrega: '15-25 min',
    frete: 0.00,
    avaliacao: 4.6,
    categoria: 'Bebidas'
  },

  // 6 Novas Empresas Premium
  {
    nome: "McDonald's",
    logo: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=200',
    banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    tempo_entrega: '15-25 min',
    frete: 4.90,
    avaliacao: 4.3,
    categoria: 'Hambúrguer'
  },
  {
    nome: 'Subway',
    logo: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200',
    banner: 'https://images.unsplash.com/photo-1540713434306-53f2485e4951?w=800',
    tempo_entrega: '20-30 min',
    frete: 5.00,
    avaliacao: 4.4,
    categoria: 'Saudável'
  },
  {
    nome: 'Pizza Hut',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
    banner: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800',
    tempo_entrega: '30-40 min',
    frete: 6.90,
    avaliacao: 4.5,
    categoria: 'Pizza'
  },
  {
    nome: 'Sushibar Premium',
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
    banner: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800',
    tempo_entrega: '40-50 min',
    frete: 8.90,
    avaliacao: 4.8,
    categoria: 'Saudável'
  },
  {
    nome: 'Starbucks Café',
    logo: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200',
    banner: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800',
    tempo_entrega: '10-20 min',
    frete: 3.90,
    avaliacao: 4.7,
    categoria: 'Bebidas'
  },
  {
    nome: 'Amor aos Pedaços',
    logo: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200',
    banner: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    tempo_entrega: '15-25 min',
    frete: 5.90,
    avaliacao: 4.6,
    categoria: 'Sobremesas'
  }
];

const PRODUTOS_NOVOS = [
  // McDonald's
  {
    nome: 'Big Mac Combo',
    descricao: 'O clássico dois hambúrgueres, alface, queijo, molho especial, cebola e picles.',
    preco: 32.90,
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    avaliacao: 4.5,
    categoria: 'Hambúrguer',
    empresa: "McDonald's"
  },
  {
    nome: 'Batata Frita Média',
    descricao: 'Batatas crocantes e douradas, salgadas na medida certa.',
    preco: 11.90,
    imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    avaliacao: 4.6,
    categoria: 'Hambúrguer',
    empresa: "McDonald's"
  },

  // Subway
  {
    nome: 'Sub Frango Teriyaki 15cm',
    descricao: 'Frango em tiras com molho teriyaki, queijo derretido e vegetais frescos.',
    preco: 24.90,
    imagem: 'https://images.unsplash.com/photo-1540713434306-53f2485e4951?w=400',
    avaliacao: 4.4,
    categoria: 'Saudável',
    empresa: 'Subway'
  },
  {
    nome: 'Cookie de Chocolate',
    descricao: 'Cookie macio com gotas de chocolate premium derretendo.',
    preco: 6.50,
    imagem: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    avaliacao: 4.8,
    categoria: 'Saudável', // Sobremesa também serve, mas cadastrado sob a empresa Subway
    empresa: 'Subway'
  },

  // Pizza Hut
  {
    nome: 'Pizza Suprema Pan',
    descricao: 'Molho de tomate, pepperoni, cebola, pimentão, champignon e queijo.',
    preco: 49.90,
    imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    avaliacao: 4.6,
    categoria: 'Pizza',
    empresa: 'Pizza Hut'
  },
  {
    nome: 'Pão de Alho Supremo',
    descricao: 'Fatias de pão com manteiga de alho e cobertura generosa de queijo gratinado.',
    preco: 15.90,
    imagem: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400',
    avaliacao: 4.5,
    categoria: 'Pizza',
    empresa: 'Pizza Hut'
  },

  // Sushibar Premium
  {
    nome: 'Combo Temaki & Rolls',
    descricao: '1 Temaki de Salmão Completo com cebolinha e cream cheese + 8 unidades de Uramaki Philadelphia.',
    preco: 48.00,
    imagem: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
    avaliacao: 4.8,
    categoria: 'Saudável',
    empresa: 'Sushibar Premium'
  },
  {
    nome: 'Sunomono Especial',
    descricao: 'Salada refrescante de pepino agridoce com gergelim preto e branco e pedaços de kani.',
    preco: 14.90,
    imagem: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    avaliacao: 4.6,
    categoria: 'Saudável',
    empresa: 'Sushibar Premium'
  },

  // Starbucks Café
  {
    nome: 'Frappuccino de Caramelo',
    descricao: 'Café batido com gelo e leite, coberto com chantilly e uma calda deliciosa de caramelo.',
    preco: 19.90,
    imagem: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    avaliacao: 4.7,
    categoria: 'Bebidas',
    empresa: 'Starbucks Café'
  },
  {
    nome: 'Croissant de Manteiga',
    descricao: 'Croissant folhado clássico amanteigado, crocante por fora e macio por dentro.',
    preco: 10.90,
    imagem: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    avaliacao: 4.6,
    categoria: 'Bebidas',
    empresa: 'Starbucks Café'
  },

  // Amor aos Pedaços
  {
    nome: 'Fatia Bolo Brigadeiro',
    descricao: 'Bolo de chocolate molhadinho com recheio e cobertura cremosos de brigadeiro gourmet.',
    preco: 16.90,
    imagem: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400',
    avaliacao: 4.8,
    categoria: 'Sobremesas',
    empresa: 'Amor aos Pedaços'
  },
  {
    nome: 'Torta de Limão',
    descricao: 'Massa crocante sablé com creme de limão siciliano azedinho e merengue italiano tostado.',
    preco: 14.90,
    imagem: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400',
    avaliacao: 4.7,
    categoria: 'Sobremesas',
    empresa: 'Amor aos Pedaços'
  }
];

async function atualizarBanco() {
  console.log('🔄 Iniciando script de migração e atualização de empresas...');

  try {
    // 1. Mapear as categorias para obter seus IDs
    const categoriesRows = await all('SELECT id, nome FROM categories');
    const categoriesMap = {};
    categoriesRows.forEach(row => {
      categoriesMap[row.nome] = row.id;
    });

    console.log('📁 Categorias encontradas:', Object.keys(categoriesMap));

    // 2. Processar Empresas
    const empIdsMap = {};

    for (const emp of EMPRESAS) {
      // Verificar se a empresa já existe no banco
      let dbEmp = await get('SELECT id FROM companies WHERE nome = ?', [emp.nome]);

      if (dbEmp) {
        // Atualiza a empresa com a logo, banner e dados novos (especialmente se estivessem sem fotos)
        await run(
          `UPDATE companies 
           SET logo = ?, banner = ?, tempo_entrega = ?, frete = ?, avaliacao = ?, categoria = ? 
           WHERE id = ?`,
          [emp.logo, emp.banner, emp.tempo_entrega, emp.frete, emp.avaliacao, emp.categoria, dbEmp.id]
        );
        empIdsMap[emp.nome] = dbEmp.id;
        console.log(`✅ Empresa atualizada com sucesso: ${emp.nome} (ID: ${dbEmp.id})`);
      } else {
        // Insere a nova empresa
        const res = await run(
          `INSERT INTO companies (nome, logo, banner, tempo_entrega, frete, avaliacao, categoria) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [emp.nome, emp.logo, emp.banner, emp.tempo_entrega, emp.frete, emp.avaliacao, emp.categoria]
        );
        empIdsMap[emp.nome] = res.lastID;
        console.log(`🆕 Nova empresa cadastrada: ${emp.nome} (ID: ${res.lastID})`);
      }
    }

    // 3. Processar Novos Produtos
    console.log('\n🍕 Verificando novos produtos...');
    for (const prod of PRODUTOS_NOVOS) {
      // Pega o ID da categoria
      const catId = categoriesMap[prod.categoria];
      // Pega o ID da empresa recém cadastrada/atualizada
      const empId = empIdsMap[prod.empresa];

      if (!catId) {
        console.warn(`⚠️ Categoria ${prod.categoria} não encontrada para o produto ${prod.nome}. Pulando.`);
        continue;
      }
      if (!empId) {
        console.warn(`⚠️ Empresa ${prod.empresa} não encontrada para o produto ${prod.nome}. Pulando.`);
        continue;
      }

      // Verificar se o produto já existe para essa empresa
      let dbProd = await get('SELECT id FROM products WHERE nome = ? AND company_id = ?', [prod.nome, empId]);

      if (dbProd) {
        // Apenas atualiza a imagem e preço se necessário
        await run(
          'UPDATE products SET descricao = ?, preco = ?, imagem = ?, avaliacao = ?, category_id = ? WHERE id = ?',
          [prod.descricao, prod.preco, prod.imagem, prod.avaliacao, catId, dbProd.id]
        );
        console.log(`   - Produto atualizado: ${prod.nome} (${prod.empresa})`);
      } else {
        // Insere
        await run(
          `INSERT INTO products (nome, descricao, preco, imagem, avaliacao, category_id, company_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)` ,
          [prod.nome, prod.descricao, prod.preco, prod.imagem, prod.avaliacao, catId, empId]
        );
        console.log(`   + Novo produto inserido: ${prod.nome} (${prod.empresa})`);
      }
    }

    console.log('\n🎉 Atualização de banco de dados concluída com sucesso!');
    await closeConnection();
  } catch (error) {
    console.error('❌ Erro durante a atualização:', error.message);
    try {
      await closeConnection();
    } catch (e) {}
    process.exit(1);
  }
}

atualizarBanco();
