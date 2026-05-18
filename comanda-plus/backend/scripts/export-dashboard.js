// backend/scripts/export-dashboard.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho para o banco de dados SQLite
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Função principal para exportar os dados
async function exportDashboardData() {
    const dashboardData = {};

    // 1. Resumo Geral
    dashboardData.resumo = await new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(id) as total_pedidos, SUM(total) as receita_total, AVG(total) as ticket_medio FROM orders`, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });

    // 2. Receita por Mês
    dashboardData.receita_por_mes = await new Promise((resolve, reject) => {
        db.all(`SELECT strftime('%Y-%m', created_at) as mes, SUM(total) as receita FROM orders GROUP BY mes ORDER BY mes`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    // 3. Receita por Forma de Pagamento
    dashboardData.receita_por_forma_pagamento = await new Promise((resolve, reject) => {
        db.all(`SELECT forma_pagamento, SUM(total) as receita FROM orders GROUP BY forma_pagamento`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    // 4. Produtos Mais Vendidos
    dashboardData.produtos_mais_vendidos = await new Promise((resolve, reject) => {
        db.all(`
            SELECT p.nome as produto, SUM(oi.quantidade) as quantidade, SUM(oi.quantidade * oi.preco_unitario) as receita
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id
            ORDER BY quantidade DESC
            LIMIT 10
        `, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    // 5. Pedidos por Status
    dashboardData.pedidos_por_status = await new Promise((resolve, reject) => {
        db.all(`SELECT status, COUNT(id) as quantidade FROM orders GROUP BY status`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    // Salvar o JSON
    const outputPath = path.resolve(__dirname, '../dashboard-comanda-plus.json');
    fs.writeFileSync(outputPath, JSON.stringify(dashboardData, null, 2));
    console.log(`✅ Dados exportados com sucesso para: ${outputPath}`);

    db.close();
}

exportDashboardData().catch(console.error);

