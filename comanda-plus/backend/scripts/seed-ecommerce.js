// backend/scripts/seed-ecommerce.js
const { db } = require('../src/config/database');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// --- Configuração dos dados a serem gerados ---
const QUANTIDADE_PEDIDOS = faker.number.int({ min: 40, max: 80 });
const DATA_INICIO = new Date(2026, 0, 1); // 01/01/2026
const DATA_FIM = new Date(2026, 3, 30);   // 30/04/2026
const STATUS_POSSIVEIS = ['pendente', 'confirmado', 'entregue', 'cancelado'];
const FORMAS_PAGAMENTO = ['pix', 'credito', 'debito', 'boleto'];

// --- Helper: Data aleatória entre duas datas ---
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// --- Helper: Formatar data para SQLite ---
function formatDateForSqlite(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// --- 1. Buscar dados de referência no banco ---
async function getReferenceData() {
    const categories = await new Promise((resolve, reject) => {
        db.all(`SELECT id FROM categories`, (err, rows) => err ? reject(err) : resolve(rows));
    });
    const companies = await new Promise((resolve, reject) => {
        db.all(`SELECT id, nome, frete FROM companies`, (err, rows) => err ? reject(err) : resolve(rows));
    });
    const products = await new Promise((resolve, reject) => {
        db.all(`SELECT id, nome, preco, company_id FROM products`, (err, rows) => err ? reject(err) : resolve(rows));
    });
    const addresses = await new Promise((resolve, reject) => {
        db.all(`SELECT id FROM addresses`, (err, rows) => err ? reject(err) : resolve(rows));
    });

    if (categories.length === 0 || companies.length === 0 || products.length === 0 || addresses.length === 0) {
        throw new Error('❌ Banco vazio ou sem dados de referência. Rode a aplicação uma vez para criar os dados mock iniciais.');
    }
    return { categories, companies, products, addresses };
}

// --- 2. Gerar pedidos e seus itens ---
async function generateOrdersAndItems({ products, companies, addresses }) {
    let orderCount = 0;
    const orders = [];
    const orderItems = [];

    for (let i = 0; i < QUANTIDADE_PEDIDOS; i++) {
        const orderDate = randomDate(DATA_INICIO, DATA_FIM);
        const company = companies[Math.floor(Math.random() * companies.length)];
        const address = addresses[Math.floor(Math.random() * addresses.length)];
        const status = STATUS_POSSIVEIS[Math.floor(Math.random() * STATUS_POSSIVEIS.length)];
        const forma_pagamento = FORMAS_PAGAMENTO[Math.floor(Math.random() * FORMAS_PAGAMENTO.length)];
        let total = 0;
        const itemsForThisOrder = [];

        const productsOfCompany = products.filter(p => p.company_id === company.id);
        const numberOfItems = faker.number.int({ min: 1, max: 5 });

        for (let j = 0; j < numberOfItems; j++) {
            if (productsOfCompany.length === 0) continue;
            const product = productsOfCompany[Math.floor(Math.random() * productsOfCompany.length)];
            const quantity = faker.number.int({ min: 1, max: 3 });
            const subtotal = quantity * product.preco;
            total += subtotal;
            itemsForThisOrder.push({
                product_id: product.id,
                quantidade: quantity,
                preco_unitario: product.preco,
            });
        }

        total += company.frete;

        orders.push({
            total: total,
            status: status,
            forma_pagamento: forma_pagamento,
            created_at: formatDateForSqlite(orderDate),
            address_id: address.id,
            company_id: company.id,
            observacao: faker.lorem.sentence(),
        });

        orderItems.push(itemsForThisOrder);
        orderCount++;
    }
    return { orders, orderItems, totalOrders: orderCount };
}

// --- 3. Salvar os dados no banco e gerar o arquivo JSON do Dashboard ---
async function saveOrdersAndItems(orders, orderItems) {
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const items = orderItems[i];

        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO orders (total, status, created_at, address_id, company_id, observacao)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [order.total, order.status, order.created_at, order.address_id, order.company_id, order.observacao],
                function(err) { err ? reject(err) : resolve(this); }
            );
        });
        const orderId = result.lastID;

        for (const item of items) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO order_items (order_id, product_id, quantidade, preco_unitario)
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.product_id, item.quantidade, item.preco_unitario],
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
    }
}

// --- Função principal ---
async function main() {
    console.log('🚀 Iniciando geração de dados realistas para o Comanda Plus...');
    try {
        const { products, companies, addresses } = await getReferenceData();
        const { orders, orderItems, totalOrders } = await generateOrdersAndItems({ products, companies, addresses });
        await saveOrdersAndItems(orders, orderItems);
        console.log(`✅ ${totalOrders} pedidos gerados com sucesso!`);
    } catch (error) {
        console.error('❌ Erro durante a execução do script:', error.message);
        process.exit(1);
    }
async function saveOrdersAndItems(orders, orderItems) {
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const items = orderItems[i];

        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO orders (total, status, created_at, address_id, company_id, observacao, forma_pagamento)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    order.total,
                    order.status,
                    order.created_at,
                    order.address_id,
                    order.company_id,
                    order.observacao,
                    order.forma_pagamento   // <--- ADICIONAMOS ESSA LINHA
                ],
                function(err) { err ? reject(err) : resolve(this); }
            );
        });
        const orderId = result.lastID;

        for (const item of items) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO order_items (order_id, product_id, quantidade, preco_unitario)
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.product_id, item.quantidade, item.preco_unitario],
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
    }
}

}

main();