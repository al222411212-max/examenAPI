import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'job_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
