const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

async function resetarSenha() {
  const dbPath = path.resolve(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);
  
  const email = 'sthephanyv021@gmail.com';
  const novaSenha = '123456';
  const hash = await bcrypt.hash(novaSenha, 10);

  db.run(
    "UPDATE users SET senha_hash = ? WHERE email = ?",
    [hash, email],
    function(err) {
      if (err) {
        console.error('Erro ao resetar senha:', err.message);
      } else if (this.changes === 0) {
        console.log('Usuário não encontrado.');
      } else {
        console.log(`✅ Senha do usuário ${email} resetada com sucesso para: ${novaSenha}`);
      }
      db.close();
    }
  );
}

resetarSenha();
