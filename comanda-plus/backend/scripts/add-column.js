// backend/scripts/add-column.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Verifica se a coluna forma_pagamento já existe
    db.all("PRAGMA table_info(orders)", (err, columns) => {
        if (err) {
            console.error("Erro ao verificar colunas:", err.message);
            db.close();
            return;
        }
        const columnExists = columns.some(col => col.name === 'forma_pagamento');
        if (columnExists) {
            console.log("✅ A coluna 'forma_pagamento' já existe na tabela orders.");
            db.close();
        } else {
            // Adiciona a coluna
            db.run("ALTER TABLE orders ADD COLUMN forma_pagamento TEXT", (err) => {
                if (err) {
                    console.error("❌ Erro ao adicionar coluna:", err.message);
                } else {
                    console.log("✅ Coluna 'forma_pagamento' adicionada com sucesso!");
                }
                db.close();
            });
        }
    });
});