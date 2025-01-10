
// Connect using mysql2
const mysql = require('mysql2');
export const dbcontext =()=>{ mysql.createConnection({
    host: 'localhost',
    user: 'ariyan',
    password: 'ariyan',
    database: 'devtalks',
  }).connect((err: Error) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL ');
  });}