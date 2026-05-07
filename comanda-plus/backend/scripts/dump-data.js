const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('--- DATA DUMP ---');

db.serialize(() => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) console.error(err);
    console.log('\nCATEGORIES:');
    console.table(rows);
  });

  db.all("SELECT id, nome, categoria FROM companies", [], (err, rows) => {
    if (err) console.error(err);
    console.log('\nCOMPANIES:');
    console.table(rows);
  });
});

setTimeout(() => db.close(), 1000);
