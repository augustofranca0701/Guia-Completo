import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Criação automática da tabela users se não existir
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
    console.log('Tabela "users" verificada/criada.');
  } catch (err) {
    console.error('Erro ao criar tabela users:', err);
  }
};

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL.');
  createTable(); // ← EXECUTA AQUI
});

pool.on('error', err => console.error('Erro no pool:', err));

export default pool;
