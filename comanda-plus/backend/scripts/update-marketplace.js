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

async function updateMarketplace() {
  try {
    console.log('🚀 Iniciando atualização do marketplace...');

    // 1. Remover categoria duplicada (ID 7 - "Nova Categoria")
    const cat7 = await get('SELECT * FROM categories WHERE id = 7');
    if (cat7 && cat7.nome === 'Nova Categoria') {
      await run('DELETE FROM categories WHERE id = 7');
      console.log('✅ Categoria duplicada (ID 7) removida.');
    } else {
      console.log('ℹ️  Categoria ID 7 não encontrada ou não é duplicada.');
    }

    // 2. Garantir que as categorias Sobremesas (4) e Bebidas (3) estão corretas
    // (Pelo dump, já sabemos que elas existem)

    // 3. Adicionar novas empresas
    const empresasMock = [
      {
        nome: 'Bacio di Latte',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A7p8P9z3Z2N_I5P5k0L-M_6xXQnF5r9_WA&s',
        tempo: '20-35 min',
        frete: 4.90,
        avaliacao: 4.9,
        categoria: 'Sobremesas',
        catId: 4
      },
      {
        nome: 'Adega 24h',
        logo: 'https://previews.123rf.com/images/vectorv/vectorv1908/vectorv190833113/129215777-wine-bottle-icon-design-template-vector-isolated.jpg', // Placeholder logo
        tempo: '15-25 min',
        frete: 0.00,
        avaliacao: 4.6,
        categoria: 'Bebidas',
        catId: 3
      }
    ];

    const companyIds = {};

    for (const emp of empresasMock) {
      // Verifica se a empresa já existe para não duplicar
      const existe = await get('SELECT id FROM companies WHERE nome = ?', [emp.nome]);
      if (!existe) {
        const r = await run(
          'INSERT INTO companies (nome, logo, tempo_entrega, frete, avaliacao, categoria) VALUES (?, ?, ?, ?, ?, ?)',
          [emp.nome, emp.logo, emp.tempo, emp.frete, emp.avaliacao, emp.categoria]
        );
        companyIds[emp.nome] = r.lastID;
        console.log(`✅ Empresa inserida: ${emp.nome} (ID: ${r.lastID})`);
      } else {
        companyIds[emp.nome] = existe.id;
        console.log(`ℹ️  Empresa ${emp.nome} já existe (ID: ${existe.id}).`);
      }
    }

    // 4. Adicionar produtos Mock para as novas empresas
    const produtosMock = [
      // Sobremesas (ID 4)
      { nome: 'Gelato 500ml', desc: 'Sabor Bacio di Latte clássico', preco: 45.0, img: null, cat: 4, emp: companyIds['Bacio di Latte'] },
      { nome: 'Picolé de Pistache', desc: 'Pistache italiano original', preco: 14.5, img: null, cat: 4, emp: companyIds['Bacio di Latte'] },
      // Bebidas (ID 3)
      { nome: 'Coca-Cola 2L', desc: 'Gelada e refrescante', preco: 12.0, img: null, cat: 3, emp: companyIds['Adega 24h'] },
      { nome: 'Cerveja Heineken 330ml', desc: 'Long neck gelada', preco: 8.9, img: null, cat: 3, emp: companyIds['Adega 24h'] },
      { nome: 'Vinho Tinto Chileno', desc: 'Cabernet Sauvignon 750ml', preco: 55.0, img: null, cat: 3, emp: companyIds['Adega 24h'] }
    ];

    for (const prod of produtosMock) {
      if (!prod.emp) continue;
      
      const existeProd = await get('SELECT id FROM products WHERE nome = ? AND company_id = ?', [prod.nome, prod.emp]);
      if (!existeProd) {
        await run(
          'INSERT INTO products (nome, descricao, preco, imagem, category_id, company_id) VALUES (?, ?, ?, ?, ?, ?)',
          [prod.nome, prod.desc, prod.preco, prod.img, prod.cat, prod.emp]
        );
        console.log(`✅ Produto inserido: ${prod.nome} para empresa ID ${prod.emp}`);
      }
    }

    console.log('✨ Atualização concluída com sucesso!');
    db.close();

  } catch (err) {
    console.error('❌ Erve ao atualizar:', err.message);
    db.close();
  }
}

updateMarketplace();
