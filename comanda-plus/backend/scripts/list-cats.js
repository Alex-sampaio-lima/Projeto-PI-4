const db = require('../src/config/database');
db.all("SELECT id, nome FROM categories", [], (err, rows) => {
  if (err) console.error(err);
  rows.forEach(r => console.log(`${r.id}: ${r.nome}`));
  db.close();
});
