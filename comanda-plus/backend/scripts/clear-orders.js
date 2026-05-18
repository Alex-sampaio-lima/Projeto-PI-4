// backend/scripts/clear-orders.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("DELETE FROM order_items", (err) => {
        if (err) console.error("Erro ao limpar order_items:", err.message);
        else console.log("✅ order_items limpo");
    });
    db.run("DELETE FROM orders", (err) => {
        if (err) console.error("Erro ao limpar orders:", err.message);
        else console.log("✅ orders limpo");
    });
    db.close();
});