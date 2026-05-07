const db = require('../src/config/database');

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function debug() {
  try {
    const categories = await all('SELECT * FROM categories');
    console.log('\n--- CATEGORIES ---');
    console.table(categories);

    const companies = await all('SELECT * FROM companies');
    console.log('\n--- COMPANIES ---');
    console.table(companies);

    db.close();
  } catch (err) {
    console.error(err);
    db.close();
  }
}

debug();
