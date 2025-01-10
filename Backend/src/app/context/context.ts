import config from "../config/config";

// Connect using mysql2
const mysql = require('mysql2');

const { database_host, database_user, database_password, database_name } = config;
export const dbcontext =()=>{ mysql.createConnection({
  host: database_host,
  user: database_user,
  password: database_password,
  database: database_name,
  port: 46768,
  connectTimeout: 10000
  }).connect((err: Error) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL ');
  });}