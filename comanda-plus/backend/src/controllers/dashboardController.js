// src/controllers/dashboardController.js
const { all, get } = require('../config/database');

const dashboardController = {
  async getExportData(req, res) {
    try {
      // 1. Resumo Geral
      const resumoQuery = await get(`
        SELECT 
          COUNT(id) AS total_pedidos,
          SUM(total) AS faturamento_total,
          AVG(total) AS ticket_medio
        FROM orders
        WHERE status != 'cancelado'
      `);

      // 2. Vendas por Empresa
      const vendasPorEmpresa = await all(`
        SELECT 
          c.nome AS empresa,
          COUNT(o.id) AS total_pedidos,
          SUM(o.total) AS faturamento
        FROM orders o
        JOIN companies c ON o.company_id = c.id
        WHERE o.status != 'cancelado'
        GROUP BY c.id
        ORDER BY faturamento DESC
      `);

      // 3. Produtos Mais Vendidos
      const produtosMaisVendidos = await all(`
        SELECT 
          p.nome AS produto,
          c.nome AS empresa,
          SUM(oi.quantidade) AS quantidade_vendida,
          SUM(oi.quantidade * oi.preco_unitario) AS receita_gerada
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN companies c ON p.company_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelado'
        GROUP BY p.id
        ORDER BY quantidade_vendida DESC
        LIMIT 10
      `);

      // 4. Pedidos por Status
      const pedidosPorStatus = await all(`
        SELECT 
          status,
          COUNT(id) AS quantidade
        FROM orders
        GROUP BY status
      `);

      const dashboardData = {
        data_geracao: new Date().toISOString(),
        resumo: {
          total_pedidos: resumoQuery.total_pedidos || 0,
          faturamento_total: resumoQuery.faturamento_total || 0,
          ticket_medio: resumoQuery.ticket_medio || 0
        },
        vendas_por_empresa: vendasPorEmpresa,
        produtos_mais_vendidos: produtosMaisVendidos,
        pedidos_por_status: pedidosPorStatus
      };

      return res.status(200).json({
        sucesso: true,
        dados: dashboardData
      });
    } catch (error) {
      console.error('Erro ao gerar dados do dashboard:', error);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno ao gerar estatísticas do dashboard.',
        erro: error.message
      });
    }
  }
};

module.exports = dashboardController;
