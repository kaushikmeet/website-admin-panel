const mysql = require('mysql2');

let db;
function handleDisconnect() {
  db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'okdigbq1_root',
    password: 'PyqCDKDWnVMT',
    database: 'okdigbq1_mydatabase',
    port: 3306,
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to MySQL!');
    }
  });

  db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connection to MySQL lost. Reconnecting...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = db;
