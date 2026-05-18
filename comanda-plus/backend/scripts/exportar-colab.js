// scripts/exportar-colab.js
// Exporta os dados de vendas simulados para o formato JSON exigido pelo Google Colab do professor de estatística

const fs = require('fs');
const path = require('path');
const { db, all } = require('../src/config/database');

const NOMES_CLIENTES = [
  'Ana Silva', 'Carlos Souza', 'Beatriz Santos', 'Daniel Oliveira', 'Eduarda Lima',
  'Felipe Costa', 'Gabriela Gomes', 'Henrique Pereira', 'Isabela Alves', 'João Rodrigues',
  'Julia Ribeiro', 'Lucas Martins', 'Mariana Carvalho', 'Mateus Almeida', 'Patricia Melo',
  'Pedro Cardoso', 'Amanda Santos', 'Bruno Rocha', 'Camila Ferreira', 'Diego Araujo',
  'Fernanda Nogueira', 'Gustavo Lima', 'Juliana Castro', 'Leonardo Cruz', 'Luana Pires',
  'Marcelo Teixeira', 'Renata Barbosa', 'Rodrigo Mendes', 'Sofia Garcia', 'Thiago Moreira'
];

const MESES_ABREV = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

async function main() {
  console.log('🚀 Iniciando exportação de dados para o Google Colab...');

  const query = `
    SELECT 
      o.id as order_id,
      o.created_at,
      o.forma_pagamento,
      c.nome as vendedor,
      a.bairro as regiao,
      p.nome as produto,
      oi.quantidade,
      oi.preco_unitario
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    JOIN companies c ON o.company_id = c.id
    JOIN addresses a ON o.address_id = a.id
    WHERE o.status = 'concluido' -- Focar apenas nas vendas concluídas para análise de faturamento
    ORDER BY o.created_at ASC
  `;

  try {
    const rows = await all(query);

    if (rows.length === 0) {
      console.warn('⚠️  Nenhuma venda concluída encontrada no banco. Por favor, rode o script de seed primeiro!');
      db.close();
      return;
    }

    console.log(`📊 Processando ${rows.length} registros de vendas...`);

    const dados = rows.map((row) => {
      const dateObj = new Date(row.created_at);
      
      // Formata a data: YYYY-MM-DD
      const pad = (num) => String(num).padStart(2, '0');
      const dataFormatada = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;

      // Mes abreviado
      const mesAbrev = MESES_ABREV[dateObj.getMonth()];

      // Cliente consistente baseado no ID do pedido
      const cliente = NOMES_CLIENTES[row.order_id % NOMES_CLIENTES.length];

      // Formas de pagamento limpas
      let formaPgto = 'Pix';
      if (row.forma_pagamento === 'credito') formaPgto = 'Cartão de Crédito';
      else if (row.forma_pagamento === 'debito') formaPgto = 'Cartão de Débito';
      else if (row.forma_pagamento === 'boleto') formaPgto = 'Boleto Bancário';

      // Valor total do item vendido (quantidade * preco_unitario)
      const valorItem = parseFloat((row.quantidade * row.preco_unitario).toFixed(2));

      return {
        Data: dataFormatada,
        Ano: dateObj.getFullYear(),
        Mês: mesAbrev,
        Vendedor: row.vendedor,
        Cliente: cliente,
        Região: row.regiao,
        Produto: row.produto,
        Valor: valorItem,
        FormaPgto: formaPgto
      };
    });

    // Calcular estatísticas dinâmicas para o metadados
    const valores = dados.map(d => d.Valor);
    const somaValores = valores.reduce((acc, v) => acc + v, 0);
    const mediaValor = somaValores / valores.length;

    const metadata = {
      fonte: "dashboard-comanda-plus.json",
      aba: "Base",
      gerado_em: new Date().toISOString().replace('T', ' ').substring(0, 19),
      total_registros: dados.length,
      periodo: {
        inicio: dados[0].Data,
        fim: dados[dados.length - 1].Data
      },
      colunas: [
        "Data",
        "Ano",
        "Mês",
        "Vendedor",
        "Cliente",
        "Região",
        "Produto",
        "Valor",
        "FormaPgto"
      ],
      tipos: {
        Data: "str",
        Ano: "int64",
        Mês: "str",
        Vendedor: "str",
        Cliente: "str",
        Região: "str",
        Produto: "str",
        Valor: "float64",
        FormaPgto: "str"
      },
      dominios: {
        vendedores: Array.from(new Set(dados.map(r => r.Vendedor))),
        clientes: Array.from(new Set(dados.map(r => r.Cliente))),
        regioes: Array.from(new Set(dados.map(r => r.Região))),
        produtos: Array.from(new Set(dados.map(r => r.Produto))),
        formas_pagamento: Array.from(new Set(dados.map(r => r.FormaPgto)))
      },
      estatisticas_valor: {
        min: Math.min(...valores),
        max: Math.max(...valores),
        media: parseFloat(mediaValor.toFixed(2)),
        soma: parseFloat(somaValores.toFixed(2))
      },
      notas: [
        "Dados gerados automaticamente a partir do banco de dados relacional SQLite do Comanda+.",
        "Os Vendedores representam as empresas e restaurantes do marketplace.",
        "As Regiões representam os bairros de entrega dos pedidos.",
        "O campo Valor representa o faturamento por item vendido (quantidade * preço unitário)."
      ]
    };

    const finalJson = {
      metadata,
      dados
    };

    const outputPath = path.resolve(__dirname, '../dashboard-comanda-plus.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalJson, null, 2), 'utf-8');

    console.log(`\n✨ Exportação concluída com sucesso!`);
    console.log(`📂 Arquivo salvo em:  ${outputPath}`);
    console.log(`📊 Vendas exportadas: ${dados.length} itens vendidos.`);
    console.log(`💰 Faturamento total: R$ ${somaValores.toFixed(2)}`);
    console.log(`⏱️  Período:           ${metadata.periodo.inicio} a ${metadata.periodo.fim}`);
    
    db.close();
  } catch (error) {
    console.error('❌ Erro durante a exportação:', error.message);
    db.close();
  }
}

main();
